import { RouterMetadata, Constructor, ControllerConstructor, METHOD, RouterDefine, Route } from "./metadata";

function routeMethodImplements(prototype: any, method: string, route: Route) {
  if (!prototype[method]) {
    const type = route.method;
    prototype[method] = async function () {
      let data = {};
      switch (type) {
        case "GET":
          data = this.ctx.getRequestData();
          break;
        default:
          data = this.ctx.getPostData();
          break;
      }
      this.ctx.json(0, "success", await this.business[method](data || {}));
    };
  }
}

function routerBusinessCreate(service: Constructor<any> | undefined, prototype: any) {
  if (service) {
    const oldInit = prototype.init || (() => { });
    prototype.init = async function () {
      await oldInit.bind(this)();
      this.business = new service(this.ctx);
    };
  }
}

export function createRouter(ctor: ControllerConstructor, name: string, root: string) {
  const prototype = <any>ctor.prototype;
  const router = <RouterMetadata>ctor.prototype["@router"];
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
    routeMethodImplements(prototype, method, route);
    console.log(routeArr);
    return routeArr;
  });
}

