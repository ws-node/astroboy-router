import { METHOD, IRouteFactory, IRouterDefine, IRoutePathConfig } from "../metadata";
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
}

interface RouteBaseConfig {
  name?: string;
  method: METHOD;
  path: IRoutePathConfig[];
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
  return function route(target: IRouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    const { routes } = tryGetRouter(target);
    const route = tryGetRoute(routes, propertyKey);
    const { method, path, name } = options;
    route.method = [method];
    route.pathConfig.push(...path);
    route.name = route.name || name;
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
  return function customApiRoute(target: IRouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    if (options.name) MetadataFactory(options.name)(target, propertyKey, descriptor);
    options.tpls.forEach(item => {
      const [tpl, sections] = typeof item === "string" ? [item, {}] : [item.tpl, item.sections || {}];
      RouteFactory({
        method,
        path: [{ path: undefined, sections, urlTpl: tpl }]
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
  return function routeMetadata(target: IRouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    const { routes } = tryGetRouter(target);
    const route = tryGetRoute(routes, propertyKey);
    route.name = alias;
  };
}
