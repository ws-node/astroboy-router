import { Router, Constructor, ControllerConstructor, METHOD, RouterDefine, Route } from "./metadata";

/**
 * ## 实现未实现的路由方法
 * * 使用astroboy的推荐写法完成默认路由实现
 * @description
 * @author Big Mogician
 * @param {*} prototype
 * @param {string} method
 * @param {Route} route
 */
function routeMethodImplements(prototype: any, method: string, route: Route, serviceCtor?: Constructor<any>) {
  if (!prototype[method]) {
    const type = route.method;
    if (serviceCtor && !serviceCtor.prototype[method]) throw new Error(`Bind business method failed : no such method which name is "${method}" found in service [${serviceCtor.name}]`);
    prototype[method] = async function () {
      let data = {};
      switch (type) {
        case "GET": // GET方法尝试获取query
          data = this.ctx.getRequestData();
          break;
        default: // 尝试获取body
          data = this.ctx.getPostData();
          break;
      }
      // 调用business的同名函数，并用json格式要求返回结果
      this.ctx.json(0, "success", await this.business[method](data || {}));
    };
  }
}

/**
 * ## 初始化业务服务
 * * 包裹controller的init函数
 * * 原始init方法完成后初始化business
 * @description
 * @author Big Mogician
 * @param {(Constructor<any> | undefined)} service
 * @param {*} prototype
 */
function routerBusinessCreate(service: Constructor<any> | undefined, prototype: any) {
  if (service) {
    const oldInit = prototype.init || (() => { });
    prototype.init = async function () {
      await oldInit.bind(this)();
      this.business = new service(this.ctx);
    };
  }
}

/**
 * ## 生成astroboy路由配置
 * @description
 * @author Big Mogician
 * @export
 * @param {ControllerConstructor} ctor
 * @param {string} name
 * @param {string} root
 * @returns 
 */
export function createRouter(ctor: ControllerConstructor, name: string, root: string) {
  const prototype = <any>ctor.prototype;
  const router = <Router>ctor.prototype["@router"];
  // 未经装饰，不符合Router的要求，终止应用程序
  if (!router) throw new Error("Create router failed : invalid router controller");
  const service = router.service;
  routerBusinessCreate(service, prototype);
  return Object.keys(router.routes).map(method => {
    const route = router.routes[method];
    const routeArr: (string | string[])[] = [];
    if (!!route.name) routeArr.push(route.name);
    routeArr.push(route.method);
    if (route.path instanceof Array) {
      routeArr.push(route.path.map(path => `${root}/${path}`));
    } else {
      routeArr.push(`${root}/${route.path}`);
    }
    routeArr.push(name);
    routeArr.push(method);
    routeMethodImplements(prototype, method, route, service);
    return routeArr;
  });
}

