/// <reference types="@types/koa-router"/>
import { IRouter, IControllerConstructor } from "../metadata";
import { buildRouteMethod } from "./build";
import { buildRouterInstance } from "./create";

interface RouterOptions {
  router: IControllerConstructor;
  name: string;
  root: string;
  debug?: boolean;
}

type RouteItem = (string | string[])[] | Record<string, any>;

function getPath(root: string, paths: string[] | string) {
  return Array.isArray(paths) ? paths.map((p) => `${root}/${p}`) : `${root}/${paths}`;
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
  let routerCtor!: IControllerConstructor;
  let routerName!: string;
  let routerRoot!: string;
  let useDebug = false;
  if (args.length === 1) {
    [routerCtor, routerName, routerRoot] = [args[0].router, args[0].name, args[0].root];
    if (args[0].debug !== undefined) useDebug = !!args[0].debug;
  } else {
    [routerCtor, routerName, routerRoot] = args;
  }
  const prototype = <any>routerCtor.prototype;
  const router = <IRouter>routerCtor.prototype["@router"];
  // 未经装饰，不符合Router的要求，终止应用程序
  if (!router) throw new Error(`Create router failed : invalid router controller [${routerCtor && (<any>routerCtor).name}]`);
  buildRouterInstance(prototype, router);
  const result: RouteItem[] = [];
  for (const methodName in router.routes) {
    const route = router.routes[methodName];
    const allRouteMethods: RouteItem[] = [];
    route.method.forEach((method) => {
      if (Object.keys(route.routeSchema).length === 0) {
        // 不存在schema，使用旧逻辑
        const routeArr: (string | string[])[] = [];
        if (!!route.name) routeArr.push(route.name);
        routeArr.push(method);
        routeArr.push(getPath(routerRoot, route.path));
        routeArr.push(routerName);
        routeArr.push(methodName);
        buildRouteMethod(prototype, methodName, router, route);
        allRouteMethods.push(routeArr);
      } else {
        // 新版本的写法
        allRouteMethods.push({
          name: route.name,
          method,
          path: getPath(routerRoot, route.path),
          schema: route.routeSchema,
          preHandler: route.routePreHandler,
          handler: `${routerName}:${methodName}`,
        });
      }
    });
    result.push(...allRouteMethods);
  }
  // Object.keys(router.routes).forEach(async (methodName) => {});
  if (useDebug) {
    // tslint:disable-next-line:no-console
    console.log(`======${routerName}======`);
    // tslint:disable-next-line:no-console
    console.log(result);
  }
  return result;
}
