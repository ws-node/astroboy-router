import { METHOD, IRouteFactory, RouterDefine } from "../metadata";
import { tryGetRouter, tryGetRoute } from "./utils";

interface RouteOptions {
  url: string;
  name: string;
}

interface RouteBaseConfig {
  name?: string;
  method: METHOD;
  path: string | string[];
  isIndex: boolean;
  tpl?: string;
}

/**
 * ## 定义路由方法
 * * 支持多路径
 * * 支持定义METHOD
 * * 区分Index和API
 * * Route不公开，做后续扩展支持
 * @description
 * @author Big Mogician
 * @param {RouteBaseConfig} options
 * @returns {IRouteFactory}
 */
function RouteFactory(options: RouteBaseConfig): IRouteFactory {
  return function route(target: RouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    const { routes } = tryGetRouter(target);
    const route = tryGetRoute(routes, propertyKey);
    const { method, path, isIndex, tpl } = options;
    route.method = method;
    route.path.push(...(path instanceof Array ? path : [path]));
    route.index = !!isIndex;
    route.urlTpl = tpl;
  };
}

/**
 * ## 定义Index页面
 * @description
 * @author Big Mogician
 * @param {string} path
 * @param {Partial<RouteOptions>} [options=undefined]
 * @returns {IRouteFactory}
 * @exports
 */
export function IndexFactory(path: string, options?: Partial<RouteOptions>): IRouteFactory;
/**
 * ## 定义Index页面
 * * 多路由支持
 * @description
 * @author Big Mogician
 * @param {string[]} path
 * @param {Partial<RouteOptions>} [options=undefined]
 * @returns {IRouteFactory}
 * @exports
 */
export function IndexFactory(path: string[], options?: Partial<RouteOptions>): IRouteFactory;
export function IndexFactory(...args: any[]): IRouteFactory {
  const options: Partial<RouteOptions> = args[1] || {};
  return function indexRoute(target: RouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    if (options.name) MetadataFactory(options.name)(target, propertyKey, descriptor);
    RouteFactory({
      method: "GET",
      path: args[0],
      isIndex: true,
      tpl: options.url
    })(target, propertyKey, descriptor);
  };
}

/**
 * ## 定义api
 * @description
 * @author Big Mogician
 * @param {METHOD} method
 * @param {string} path
 * @returns {IRouteFactory}
 * @exports
 */
export function APIFactory(method: METHOD, path: string, options?: Partial<RouteOptions>): IRouteFactory;
export function APIFactory(...args: any[]): IRouteFactory {
  const options: Partial<RouteOptions> = args[2] || {};
  return function apiRoute(target: RouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    if (options.name) MetadataFactory(options.name)(target, propertyKey, descriptor);
    RouteFactory({
      method: args[0],
      path: [args[1]],
      isIndex: false,
      tpl: options.url
    })(target, propertyKey, descriptor);
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