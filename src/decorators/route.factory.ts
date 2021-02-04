import {
  METHOD,
  IRouteFactory,
  IRouterDefine,
  IRoutePathConfig,
  IPipeProcess,
  PipeErrorHandler,
  MapLike,
  IRouteUrlTpl_DEPERACTED,
  IRouteUrlPattern,
  IRouteCheckSchema,
} from "../metadata";
import { tryGetRouter, tryGetRoute } from "./utils";

type UrlPatternV1 = string | IRouteUrlTpl_DEPERACTED;
type UrlPatternv2 = string | IRouteUrlPattern;
type UrlPattern = UrlPatternV1 | UrlPatternv2;

export interface CustomRouteOptions {
  /** 路由方法，默认值：`'GET'` */
  method?: METHOD;
  /** 路由path部分的填充值，默认值：`undefined` */
  path?: string[];
  /** @deperacted [ replace with `patterns` ] url模板，用来自定义生成的url，默认值：`[]` */
  tpls?: (string | IRouteUrlTpl_DEPERACTED)[];
  /** url模板，用来自定义生成的url，默认值：`[]` */
  patterns?: (string | IRouteUrlPattern)[];
  /** 路由名字，默认值：`undefined` */
  name?: string;
  /** 覆盖parent路由集的url生成模版，默认：`false` */
  forceRouter?: boolean;
  /** 扩展结构，默认：`{}` */
  extensions?: any;
}

export interface CustomPipeOptions extends Partial<IPipeBaseConfig> {
  /** 扩展结构，默认：`{}` */
  extensions?: any;
}

export interface CustomUtilOptions extends Partial<IRouteUtilConfig> {
  /** 扩展结构，默认：`{}` */
  extensions?: any;
}

interface IRouteUtilConfig {
  /** 前置执行的路由，某个新版本加入的功能 */
  preHandler: string[];
  /** 支持使用schema对请求内容检查，某个新版本加入的功能 */
  schema: Partial<IRouteCheckSchema>;
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
  pathSection?: string[];
  path?: IRoutePathConfig[];
  pipeConfigs?: Partial<IPipeBaseConfig>;
  pipeOverride?: boolean;
  extensions?: MapLike<any>;
  routePreHandler?: string[];
  routeSchema?: Partial<IRouteCheckSchema>;
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
    const { method, pathSection = [], path = [], name, pipeConfigs = {}, extensions = {}, pipeOverride, routePreHandler, routeSchema } = options;
    const { handler, rules, zIndex = "push", override = undefined } = pipeConfigs;
    route.method = !!method ? [method] : route.method;
    route.name = name ?? route.name;
    route.pipes.handler = handler || route.pipes.handler;
    route.extensions = {
      ...route.extensions,
      ...extensions,
    };
    if (pipeOverride !== void 0) {
      route.pathOverride = pipeOverride;
    }
    if (pathSection.length > 0) {
      route.pathSection.push(...pathSection);
    }
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
    if (routePreHandler) {
      route.routePreHandler = [...route.routePreHandler, ...routePreHandler];
    }
    if (routeSchema) {
      route.routeSchema = { ...route.routeSchema, ...routeSchema };
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
  const { method, name, path, patterns = [], tpls = [], extensions = {}, forceRouter: force } = options;
  // 兼容旧版tpls字段
  const templates = (<UrlPattern[]>(patterns.length === 0 ? tpls : patterns)).map(decidePatternVersion);
  return function customRoute(target: IRouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    RouteFactory({
      name,
      method,
      pathSection: path,
      path: templates.map(([pattern, sections]) => ({ pattern, sections })),
      extensions,
      pipeOverride: force,
    })(target, propertyKey, descriptor);
  };
}

/**
 * ## 自定义的额外功能
 * @description
 * @author Big Mogician
 * @export
 * @param {CustomUtilOptions} options
 * @returns {IRouteFactory}
 * @exports
 */
export function CustomUtilFactory(options: CustomUtilOptions): IRouteFactory {
  const { extensions, preHandler, schema } = options;
  return function customUtil(target: IRouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    RouteFactory({ routePreHandler: preHandler, routeSchema: schema, extensions })(target, propertyKey, descriptor);
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

export function decidePatternVersion(each: UrlPattern): [string, MapLike<string>] {
  return typeof each === "string" ? [each, {}] : [(<IRouteUrlPattern>each).pattern || (<IRouteUrlTpl_DEPERACTED>each).tpl, each.sections || {}];
}
