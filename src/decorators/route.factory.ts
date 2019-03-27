import { METHOD, IRouteFactory, IRouterDefine, IRoutePathConfig, IPipeProcess, PipeErrorHandler, MapLike } from "../metadata";
import { tryGetRouter, tryGetRoute } from "./utils";

export interface CustomRouteOptions {
  method?: METHOD;
  tpls?: (string | { tpl: string; sections?: { [key: string]: string } })[];
  name?: string;
  extensions?: any;
}

export interface CustomPipeOptions extends Partial<IPipeBaseCOnfig> {}

interface IPipeBaseCOnfig {
  override: boolean;
  zIndex: "unshift" | "push";
  rules: IPipeProcess[];
  handler: PipeErrorHandler;
}

interface RouteBaseConfig {
  name?: string;
  method?: METHOD;
  path?: IRoutePathConfig[];
  pipeConfigs?: Partial<IPipeBaseCOnfig>;
  extensions?: MapLike<any>;
}

/**
 * ## 定义路由方法
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
    const { method, path = [], name, pipeConfigs = {}, extensions = {} } = options;
    const { handler, rules = [], zIndex = "push", override = false } = pipeConfigs;
    route.method = !!method ? [method] : route.method;
    route.name = name || route.name;
    route.pipes.handler = handler || route.pipes.handler;
    route.extensions = {
      ...route.extensions,
      ...extensions
    };
    if (path.length > 0) {
      route.pathConfig.push(...path);
    }
    if (!override) {
      route.pipes.extend = true;
      route.pipes.rules[zIndex](...rules);
    } else {
      route.pipes.extend = false;
      route.pipes.rules = rules;
    }
  };
}

/**
 * ## 自定义的路由
 * @description
 * @author Big Mogician
 * @export
 * @param {CustomRouteOptions} options
 * @returns {IRouteFactory}
 * @exports
 */
export function CustomRouteFactory(options: CustomRouteOptions): IRouteFactory {
  const { method, name, tpls = [] } = options;
  return function customRoute(target: IRouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    RouteFactory({
      name,
      method,
      path: tpls.map(item =>
        typeof item === "string" ? { path: undefined, sections: {}, urlTpl: item } : { path: undefined, sections: item.sections || {}, urlTpl: item.tpl }
      )
    })(target, propertyKey, descriptor);
  };
}

/**
 * ## 自定义的管道
 * @description
 * @author Big Mogician
 * @export
 * @param {CustomPipeOptions} options
 * @returns {IRouteFactory}
 * @exports
 */
export function CustomPipeFactory(options: CustomPipeOptions): IRouteFactory {
  return function customPipe(target: IRouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    RouteFactory({ pipeConfigs: options })(target, propertyKey, descriptor);
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
