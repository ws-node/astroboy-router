/// <reference types="@types/koa-router"/>
import { Router, ControllerConstructor } from "../metadata";
import { routerBusinessCreate } from "./service-init";
import { routeMethodImplements } from "./route-implements";
import { resolveDefaultBodyParser } from './utils';

/**
 * ## 生成astroboy路由配置
 * @description
 * @author Big Mogician
 * @export
 * @param {ControllerConstructor} ctor
 * @param {string} name
 * @param {string} root
 * @returns 
 * @exports
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