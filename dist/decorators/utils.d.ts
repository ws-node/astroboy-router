import { RouterDefine, IController, IRouter, Route, UrlTplTuple } from "../metadata";
/**
 * ## 获取router配置参数
 * * 如果是第一次配置，先做存储
 * @description
 * @author Big Mogician
 * @param {(RouterDefine | IController)} target 控制器原型
 * @returns
 * @exports
 */
export declare function tryGetRouter(target: RouterDefine | IController): IRouter<any>;
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
export declare function tryGetRoute(routes: {
    [key: string]: Route;
}, key: string): Route<any>;
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
 * @param {UrlTplTuple} tpl
 * @param {{ [key: string]: string }} tplSections
 * @returns
 * @exports
 */
export declare function routeConnect(prefix: string, apiPrefix: string, pathStr: string, isIndex: boolean, tpl: UrlTplTuple, tplSections: {
    [key: string]: string;
}): string;
