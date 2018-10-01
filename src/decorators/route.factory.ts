import { METHOD, IRouteFactory, RouterDefine } from "../metadata";
import { tryGetRouter, tryGetRoute } from "./utils";

/**
 * ## 定义路由方法
 * * 支持多路径
 * * 支持定义METHOD
 * * 区分Index和API
 * * Route不公开，做后续扩展支持
 * @description
 * @author Big Mogician
 * @param {METHOD} method
 * @param {string} path
 * @param {boolean} [inIndex]
 * @returns {IRouteFactory}
 */
function RouteFactory(method: METHOD, path: string, inIndex?: boolean): IRouteFactory;
function RouteFactory(method: METHOD, path: string[], isIndex?: boolean): IRouteFactory;
function RouteFactory(...args: any[]): IRouteFactory {
  return function route(target: RouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    const { routes } = tryGetRouter(target);
    const route = tryGetRoute(routes, propertyKey);
    route.method = args[0];
    route.path = args[1];
    route.index = !!args[2];
  };
}

/**
 * ## 定义Index页面
 * @description
 * @author Big Mogician
 * @param {string} path
 * @returns {IRouteFactory}
 * @exports
 */
export function IndexFactory(path: string): IRouteFactory;
/**
 * ## 定义Index页面
 * * 多路由支持
 * @description
 * @author Big Mogician
 * @param {string[]} path
 * @returns {IRouteFactory}
 * @exports
 */
export function IndexFactory(path: string[]): IRouteFactory;
export function IndexFactory(...args: any[]): IRouteFactory {
  return function indexRoute(target: RouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    RouteFactory("GET", args[0], true)(target, propertyKey, descriptor);
  };
}

/**
 * ## 定义api
 * * api不支持多路由映射
 * @description
 * @author Big Mogician
 * @param {METHOD} method
 * @param {string} path
 * @returns {IRouteFactory}
 * @exports
 */
export function APIFactory(method: METHOD, path: string): IRouteFactory;
export function APIFactory(...args: any[]): IRouteFactory {
  return function apiRoute(target: RouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    RouteFactory(args[0], args[1], false)(target, propertyKey, descriptor);
  };
}

/**
 * ## 路由元数据
 * * 目前支持为路由命名
 * @description
 * @author Big Mogician
 * @param {string} alias
 * @returns {RouteFactory}
 * @exports
 */
export function MetadataFactory(alias: string): IRouteFactory {
  return function routeMetadata(target: RouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    const { routes } = tryGetRouter(target);
    const route = tryGetRoute(routes, propertyKey);
    route.name = alias;
  };
}