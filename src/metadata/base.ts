import { PipeErrorHandler, IPipeResolveContext } from "./pipe";
import { IRouteArguContent } from "./params";
import { IRouterCreateDefine, IRouterLifeCycle, IRouterEvents } from "./lifecycle";

/**
 * 表示当前属性或变量的值必然不为undefined
 * * 如果当前字段类型不含null并且字段非可选，则无需进行空值检测
 * * 配合TS的strickNullCheck使用
 */
export type Exist<T> = Exclude<T, undefined>;
/** 明确表示当前目标可能为undefined */
export type Unsure<T> = Exist<T> | undefined;
export interface Constructor<T> {
  new (...args: any[]): T;
}

export interface MapLike<T> {
  [prop: string]: T;
}

export type METHOD = "GET" | "POST" | "PUT" | "DELETE";

export interface IAstroboyBaseClass<T = any> {
  ctx: T;
}

export interface IRoutePipeDefine {
  handler: PipeErrorHandler;
}

export interface IRouterPipeDefine extends IRoutePipeDefine {
  extend?: boolean;
}

// tslint:disable-next-line: class-name
export interface IRouteUrlTpl_DEPERACTED {
  tpl: string;
  sections?: MapLike<string>;
}

export interface IRouteUrlPattern {
  pattern: string;
  sections?: MapLike<string>;
}

export interface IRoutePathConfig {
  path?: string;
  pattern: string | undefined;
  sections: MapLike<string>;
}

export interface IRouterPatternConfig {
  patterns: IRouteUrlPattern[];
  sections: MapLike<any>;
}

/**
 * ## Astroboy-Router 路由定义
 *
 * @author Big Mogician
 * @export
 * @interface IRoute
 * @template P pipe resturn type
 */
export interface IRoute<P = void> {
  /** 当前路由是否已经被解析完毕，默认：`false` */
  resolved: boolean;
  /** 当前路由名称，用于路由表生成的备注，默认：`undefined` */
  name: Unsure<string>;
  /** 当前路由的http协议类型，默认：`['GET']` */
  method: METHOD[];
  /** 当前路由解析后的所有url集合，默认：`[]` */
  path: Array<string>;
  /** 当前路由所有url-pattern集合，默认：`[]` */
  pathConfig: Array<IRoutePathConfig>;
  /** 当前路由url-pattern集合是否覆盖父路由集的规则，默认：`false` */
  pathOverride: boolean;
  /** 当前路由所有的pipe管道集合，默认：`{ extend: true, rules: [] }` */
  pipes: IPipeResolveContext<P> & { extend: boolean };
  /** 当前路由的所有args参数定义，默认：`{ hasArgs: false, context: {}, maxIndex: -1, aolutions: [] }` */
  args: IRouteArguContent;
  /** 扩展字段集，用于第三方进行扩展内容补充，默认：`{}` */
  extensions: MapLike<any>;
}

/**
 * ## Astroboy-Router 路由集定义
 *
 * @author Big Mogician
 * @export
 * @interface IRouter
 * @template P pipe return type
 */
export interface IRouter<P = void> {
  /** 路由集标识，group代表着url中的表示业务范畴的一级，默认：`undefined` */
  group: string;
  /** 路由组，由所有路由方法组成的map-like对象，默认：`{}` */
  routes: MapLike<IRoute>;
  /** 路由集的模式，为当前路由集定制生成url的规则，可以被路由的模式覆盖，默认：`{ patterns: [], sections: {} }` */
  pattern: IRouterPatternConfig;
  /** 依赖的服务列表，兼容v1版本存在，默认：`new Map()` */
  dependency: Map<Constructor<any>, string>;
  /** 路由集的管道中间件，定义所有子路由的默认前置流程，默认：`{ rules: [] }` */
  pipes: IPipeResolveContext<P>;
  /** 路由集的Create构造钩子，用于覆盖或扩展控制器路由初始化的后续逻辑，默认：`[]` */
  onCreate: Array<IRouterCreateDefine>;
  /** 路由集的路由生命周期钩子，用于定义自路由所有生命周期行为，默认：`[]` */
  lifeCycle: Partial<IRouterLifeCycle>;
  /** 扩展字段集，用于第三方进行扩展内容补充，默认：`{}` */
  extensions: MapLike<any>;
}

export interface IRouterMetaConfig<P = void> {
  group?: string;
  pipes?: IPipeResolveContext<P>;
  pattern?: Partial<{
    patterns: (string | IRouteUrlPattern)[];
    sections: MapLike<string>;
  }>;
  extensions?: MapLike<any>;
  /**
   * ### 注册路由钩子
   * * example 👇:
   * ```typescript
   * @Router({
   *   group: "xxx",
   *   register(delegate) {
   *     delegate.lifecycle("onEnter", ({ name }, controller) => {
   *       console.log(`route ${name} is running.`);
   *     })
   *   }
   * })
   * class X { ... }
   * ```
   *
   * @author Big Mogician
   * @param {IRouterEvents} delegate 挂钩对象的委托
   * @memberof IRouterMetaConfig
   */
  register?(delegate: IRouterEvents): void;
}

export interface IRouterDefine {
  "@router"?: IRouter;
}

export type IRouterPrototype<T = {}> = T & IRouterDefine;

export interface IControllerConstructor<T = any> {
  prototype: IRouterPrototype<T>;
}

export abstract class IController implements IAstroboyBaseClass {
  [key: string]: any;
  ctx: any;
}

export type IRouteFactory = <T>(target: T, propertyKey: string, descriptor?: PropertyDescriptor) => any;
export type IRouterFactory = <T>(target: T) => any;
export type IMixinFactory = <T>(target: T, propertyKey?: string) => any;
