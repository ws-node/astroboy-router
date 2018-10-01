import {
  RouterDefine,
  IController,
  Router,
  Route
} from "../metadata";
import { RouterMap } from "../core";

/**
 * ## 获取router配置参数
 * * 如果是第一次配置，先做存储
 * @description
 * @author Big Mogician
 * @param {(RouterDefine | IController)} target 控制器原型
 * @returns
 * @exports
 */
export function tryGetRouter(target: RouterDefine | IController) {
  const routerSaved = RouterMap.get(target);
  let router: Router;
  router = <Router>routerSaved;
  if (!routerSaved) {
    router = {
      prefix: "",
      apiPrefix: "api",
      routes: {},
      dependency: new Map(),
      auth: {
        rules: [],
        errorMsg: "Auth failed."
      }
    };
    RouterMap.set(target, router);
  }
  target["@router"] = router;
  return router;
}

/**
 * ## 获取route配置参数
 * * 如果是第一次配置当前路由项，先做初始化
 * @description
 * @author Big Mogician
 * @param {{ [key: string]: Route }} routes
 * @param {string} key
 * @returns
 * @exports
 */
export function tryGetRoute(routes: { [key: string]: Route }, key: string) {
  let route = routes[key];
  if (!route) {
    route = routes[key] = {
      name: undefined,
      method: "GET",
      path: "",
      index: false,
      auth: {
        rules: [],
        extend: true,
        errorMsg: "Auth failed."
      }
    };
  }
  return route;
}


/**
 * ## 连接路由
 * * 连接router前缀和path
 * * API路由在前缀和路由根之间插入`api`层级
 * @description
 * @author Big Mogician
 * @param {string} prefix
 * @param {string} apiPrefix
 * @param {string} pathStr
 * @param {boolean} isIndex
 * @returns
 * @exports
 */
export function routeConnect(prefix: string, apiPrefix: string, pathStr: string, isIndex: boolean) {
  const splits: string[] = [];
  if (!isIndex) splits.push(apiPrefix);
  if (prefix !== "") splits.push(prefix);
  if (!!pathStr) splits.push(pathStr);
  return splits.join("/");
}
