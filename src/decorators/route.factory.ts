import { METHOD, IRouteFactory, IRouterDefine, IRoutePathConfig, IPipeProcess, PipeErrorHandler, MapLike } from "../metadata";
import { tryGetRouter, tryGetRoute } from "./utils";

export interface CustomRouteOptions {
  /** 路由方法，默认值：`'GET'` */
  method?: METHOD;
  /** url模板，用来自定义生成的url，默认值：`[]` */
  tpls?: (string | { tpl: string; sections?: { [key: string]: string } })[];
  /** 路由名字，默认值：`undefined` */
  name?: string;
  /** 扩展结构，默认：`{}` */
  extensions?: any;
}

export interface CustomPipeOptions extends Partial<IPipeBaseConfig> {
  /** 扩展结构，默认：`{}` */
  extensions?: any;
}

interface IPipeBaseConfig {
  /** 是否重载覆盖Router级别的pipe配置，默认：`false` */
  override: boolean;
  /** 附加pipe的方式，默认：`'push'` */
  zIndex: "unshift" | "push";
  /** 附加的pipes，默认：`[]` */
  rules: IPipeProcess[];
  /** pipes的错误处理捕捉函数，默认：`undefined` */
  handler: PipeErrorHandler;
}

interface RouteBaseConfig {
  name?: string;
  method?: METHOD;
  path?: IRoutePathConfig[];
  pipeConfigs?: Partial<IPipeBaseConfig>;
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
    const { handler, rules, zIndex = "push", override = undefined } = pipeConfigs;
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
    if (!rules) return;
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
  const { method, name, tpls = [], extensions = {} } = options;
  return function customRoute(target: IRouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    RouteFactory({
      name,
      method,
      path: tpls.map(item =>
        typeof item === "string" ? { path: undefined, sections: {}, urlTpl: item } : { path: undefined, sections: item.sections || {}, urlTpl: item.tpl }
      ),
      extensions
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
  const { extensions, ...others } = options;
  return function customPipe(target: IRouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    RouteFactory({ pipeConfigs: others, extensions })(target, propertyKey, descriptor);
  };
}
