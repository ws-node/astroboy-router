/// <reference types="@types/koa-router"/>
import { Router, Constructor, ControllerConstructor, METHOD, RouterDefine, Route, BodyResolve, AuthGuard } from "./metadata";
import { BaseClass } from 'astroboy';

function routeMeta(key: string): string {
  return `@metadata::${key}`;
}

/**
 * ## 实现未实现的路由方法
 * * 使用astroboy的推荐写法完成默认路由实现
 * @description
 * @author Big Mogician
 */
function routeMethodImplements(metadata: {
  prototype: any,
  method: string,
  route: Route,
  auth: { rules: AuthGuard[], errorMsg: string, error?: any },
  serviceCtor: Constructor<any> | undefined,
  scopeService: boolean,
  resolve: BodyResolve
}) {
  const { prototype, method, route, auth, serviceCtor, resolve, scopeService: isScope } = metadata;
  if (!prototype[method]) {
    const type = route.method;
    if (!serviceCtor) throw new Error("Create route method failed: init an abstract route method without a service is not allowed.");
    if (!serviceCtor.prototype[method]) throw new Error(`Bind service method failed : no such method which name is "${method}" found in service [${serviceCtor.name}]`);
    prototype[method] = async function () {
      let data = [];
      const queryInvoke = resolve.getQuery(this);
      const postInvoke = resolve.getPost(this);
      const jsonInvoke = resolve.toJson(this);
      switch (type) {
        case "GET": // GET方法尝试获取query
          data.push(queryInvoke());
          break;
        default: // 尝试获取body和query
          data.push(postInvoke());
          data.push(queryInvoke());
          break;
      }
      if (!this.business || isScope) {
        this.business = this[routeMeta("business")] = new serviceCtor(this.ctx);
      }
      // 调用business的同名函数，并用json格式要求返回结果
      jsonInvoke(0, "success", await this.business[method](...data));
    };
  }
  if (auth.rules.length > 0) {
    const { rules, errorMsg, error } = auth;
    const authPreloads = async (ctx: AstroboyContext, afterMethod: () => any) => {
      for (const guard of rules) {
        const valid = await guard(ctx);
        if (!valid) throw error || new Error(errorMsg);
      }
      afterMethod();
    }
    const oldProtoMethod = prototype[method];
    prototype[method] = async function () {
      await authPreloads(this.ctx, oldProtoMethod.bind(this));
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
 * @param {any} prototype
 * @param {Map<Constructor<any>, string>} depedency
 */
function routerBusinessCreate(service: Constructor<any> | undefined, prototype: any, depedency: Map<Constructor<any>, string>) {
  if (service) {
    const oldInit = prototype.init || (() => { });
    prototype.init = async function () {
      await oldInit.bind(this)();
      this.business = new service(this.ctx);
    };
    const funcName = prototype.constructor.name;
    Array.from(depedency.entries()).forEach(([service, key]) => {
      if (key === "business") throw new Error(`Inject service failed: you can not define business service manually on router [${funcName}].`);
      const metaKey = routeMeta(key);
      try {
        Object.defineProperty(prototype, key, {
          get: function () { return this[metaKey] || (this[metaKey] = new service(this.ctx)); },
          configurable: false,
          enumerable: false
        });
      } catch (error) {
        throw new Error(`Inject service failed: duplicate service property [${key}] name on router [${funcName}]`);
      }
    });
  }
}

function defaultGetQueryFac(instance: BaseClass) {
  return () => instance.ctx.query;
};

function defaultGetPostFac(instance: BaseClass) {
  return () => (<any>instance.ctx.request).body;
};

function defaultToJsonFac<T>(instance: BaseClass) {
  // @ts-ignore
  return <T>(code: any, msg: any, data: T) => instance.ctx.body = {
    code,
    msg,
    data
  };
}

function resolveDefaultBodyParser(): BodyResolve {
  const pwd = process.env.PWD;
  let config: any;
  try {
    const defaultConfig = require(`${pwd}/app/config/config.default.js`);
    config = (defaultConfig && defaultConfig["@router-metadata"]) || {};
  } catch (error) {
    config = {};
  }
  const result: BodyResolve = {
    getQuery: defaultGetQueryFac,
    getPost: defaultGetPostFac,
    toJson: defaultToJsonFac
  };
  if (config.getQuery) {
    const queryKey = config.getQuery;
    result.getQuery = (instance: BaseClass) => {
      // @ts-ignore
      return () => instance.ctx[queryKey]();
    }
  }
  if (config.getPost) {
    const postKey = config.getPost;
    result.getPost = (instance: BaseClass) => {
      // @ts-ignore
      return () => instance.ctx[postKey]();
    }
  }
  if (config.toJson) {
    const toJsonKey = config.toJson;
    result.toJson = (instance: BaseClass) => {
      // @ts-ignore
      return (code, msg, data) => instance.ctx[toJsonKey](code, msg, data);
    }
  }
  return result;
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
  if (!router) throw new Error(`Create router failed : invalid router controller [${ctor && (<any>ctor).name}]`);
  const service = router.service;
  routerBusinessCreate(service, prototype, router.dependency);
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
    const { extend, rules, errorMsg, error } = route.auth;
    routeMethodImplements({
      prototype,
      method,
      route,
      auth: {
        rules: extend ? [...router.auth.rules, ...rules] : rules,
        errorMsg: extend ? errorMsg : router.auth.errorMsg,
        error: extend ? error : router.auth.error
      },
      serviceCtor: route.service || service || undefined,
      scopeService: route.service !== undefined,
      resolve: resolveDefaultBodyParser()
    });
    return routeArr;
  });
}