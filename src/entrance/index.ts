/// <reference types="@types/koa-router"/>
import { IRouter, IControllerConstructor } from "../metadata";
import { routerBusinessCreate } from "./service-init";
import { routeMethodImplements } from "./route-implements";
import { resolveDefaultBodyParser } from "./utils";

interface RouterOptions {
  router: IControllerConstructor;
  name: string;
  root: string;
  debug?: boolean;
}

/**
 * ## 生成astroboy路由配置
 * @description
 * @author Big Mogician
 * @export
 * @param {IControllerConstructor} ctor
 * @param {string} name
 * @param {string} root
 * @returns
 * @exports
 */
export function createRouter(ctor: IControllerConstructor, name: string, root: string): (string | string[])[][];
export function createRouter(options: RouterOptions): (string | string[])[][];
export function createRouter(...args: any[]) {
  let ctor!: IControllerConstructor;
  let name!: string;
  let root!: string;
  let debug = false;
  if (args.length === 1) {
    [ctor, name, root] = [args[0].router, args[0].name, args[0].root];
    if (args[0].debug !== undefined) debug = !!args[0].debug;
  } else {
    [ctor, name, root] = args;
  }
  const prototype = <any>ctor.prototype;
  const router = <IRouter>ctor.prototype["@router"];
  // 未经装饰，不符合Router的要求，终止应用程序
  if (!router) throw new Error(`Create router failed : invalid router controller [${ctor && (<any>ctor).name}]`);
  const service = router.service;
  routerBusinessCreate(service, prototype, router.dependency);
  const result: (string | string[])[][] = [];
  Object.keys(router.routes).forEach(methodName => {
    const route = router.routes[methodName];
    const allRouteMethods: (string | string[])[][] = [];
    route.method.forEach(method => {
      const routeArr: (string | string[])[] = [];
      if (!!route.name) routeArr.push(route.name);
      routeArr.push(method);
      if (route.path instanceof Array) {
        routeArr.push(route.path.map(path => `${root}/${path}`));
      } else {
        routeArr.push(`${root}/${route.path}`);
      }
      routeArr.push(name);
      routeArr.push(methodName);
      const { extend, rules, errorMsg, error } = route.auth;
      routeMethodImplements({
        prototype,
        method,
        methodName,
        auth: {
          rules: extend ? [...router.auth.rules, ...rules] : rules,
          errorMsg: errorMsg || router.auth.errorMsg || "Auth failed.",
          error: error || router.auth.error
        },
        serviceCtor: route.service || service || undefined,
        scopeService: route.service !== undefined,
        resolve: resolveDefaultBodyParser()
      });
      allRouteMethods.push(routeArr);
    });
    result.push(...allRouteMethods);
  });
  if (debug) {
    // tslint:disable-next-line:no-console
    console.log(`======${name}======`);
    // tslint:disable-next-line:no-console
    console.log(result);
  }
  return result;
}
