/// <reference types="@types/koa-router"/>
import { IRouter, IControllerConstructor } from "../metadata";
import { buildRouteMethod } from "./route-implements";
import { buildRouterInstance } from "./service-init";
// import { routerBusinessCreate } from "./service-init";
// import { routeMethodImplements } from "./route-implements";
// import { resolveDefaultBodyParser } from "./utils";

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
  buildRouterInstance(prototype, router);
  const result: (string | string[])[][] = [];
  for (const methodName in router.routes) {
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
      buildRouteMethod(prototype, methodName, router, route);
      allRouteMethods.push(routeArr);
    });
    result.push(...allRouteMethods);
  }
  Object.keys(router.routes).forEach(async methodName => {});
  if (debug) {
    // tslint:disable-next-line:no-console
    console.log(`======${name}======`);
    // tslint:disable-next-line:no-console
    console.log(result);
  }
  return result;
}
