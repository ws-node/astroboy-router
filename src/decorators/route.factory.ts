import { METHOD, IRouteFactory, RouterDefine, RoutePathConfig } from "../metadata";
import { tryGetRouter, tryGetRoute } from "./utils";

interface RouteOptions {
  /** 路由命名，实现@Metadata相同能力 */
  name: string;
  /** 重置当前路由模板 */
  tpl: string;
  /** 提供当前路由模板的参数 */
  sections?: { [key: string]: string };
}

interface CustonRouteOptions {
  method: METHOD;
  tpls: (string | { tpl: string; sections?: { [key: string]: string } })[];
  name?: string;
  isIndex?: boolean;
}

interface RouteBaseConfig {
  name?: string;
  method: METHOD;
  path: RoutePathConfig[];
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
    // 封锁多method的能力，暂时没有用单一路由处理多method的需求，
    // 根据情况未来可能考虑做开放
    route.method = [method];
    route.pathConfig.push(...path);
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
    const paths: string[] = args[0] instanceof Array ? args[0] : [args[0]];
    RouteFactory({
      method: "GET",
      path: paths.map(path => ({ path, sections: options.sections || {} })),
      isIndex: true,
      tpl: options.tpl
    })(target, propertyKey, descriptor);
  };
}

/**
 * ## 定义api
 * @description
 * @author Big Mogician
 * @param {METHOD} method
 * @param {string} path
 * @param {Partial<RouteOptions>} [options=undefined]
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
      path: [{ path: args[1], sections: options.sections || {} }],
      isIndex: false,
      tpl: options.tpl
    })(target, propertyKey, descriptor);
  };
}

/**
 * ## 自定义的路由
 * @description
 * @author Big Mogician
 * @export
 * @param {CustonRouteOptions} options
 * @returns {IRouteFactory}
 * @exports
 */
export function CustomRouteFactory(options: CustonRouteOptions): IRouteFactory {
  const method = options.method;
  const isIndex = !!options.isIndex;
  return function customApiRoute(target: RouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    if (options.name) MetadataFactory(options.name)(target, propertyKey, descriptor);
    options.tpls.forEach(item => {
      const [tpl, sections] = typeof item === "string" ? [item, {}] : [item.tpl, item.sections || {}];
      RouteFactory({
        method,
        path: [{ path: "", sections, urlTpl: tpl }],
        isIndex,
        tpl
      })(target, propertyKey, descriptor);
    });
  };
}

/**
 * #### deprecated : 使用@Index或者@API的最后一个options参数代替
 * ## 路由元数据
 * * 目前支持为路由命名
 * @deprecated
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
