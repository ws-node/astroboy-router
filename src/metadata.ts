/**
 * 表示当前属性或变量的值必然不为undefined
 * * 如果当前字段类型不含null并且字段非可选，则无需进行空值检测
 * * 配合TS的strickNullCheck使用
 */
type Exist<T> = Exclude<T, undefined>;
/** 明确表示当前目标可能为undefined */
type Unsure<T> = Exist<T> | undefined;
export interface Constructor<T> {
  new (...args: any[]): T;
}

export interface MapLike<T> {
  [prop: string]: T;
}

export type METHOD = "GET" | "POST" | "PUT" | "DELETE";

/** 未实现的路由方法 */
export type RouteMethod = () => any;

export type IPipeProcess<T = void> = (context: any) => Promise<T> | T;

export type UrlTplTuple = [string | undefined, string | undefined];

export interface IAstroboyBaseClass<T = any> {
  ctx: T;
}

export interface LifeCycleMethod {
  <T = any>(ctor: IAstroboyBaseClass<T>): void | Promise<void>;
}

export interface IRouterBuildContext {
  router: IRouter;
  name?: string;
  route?: IRoute;
}

export interface IRouterBuilderDefine {
  <T extends IRouterBuildContext = IRouterBuildContext>(context: T, prototype: any): void;
}

export interface ConstructorInitMethod {
  <T extends IRouterBuildContext = IRouterBuildContext>(context: T, prototype: any): void;
}

export type LifeCycleRegister = <K extends keyof IRouterLifeCycle>(
  name: K,
  resolver: K extends "onCreate" ? ConstructorInitMethod : LifeCycleMethod,
  reset?: boolean
) => void;
export type BuilderRegister = (resolver: IRouterBuilderDefine, reset?: boolean) => void;

export interface IRouterEvents {
  lifecycle: LifeCycleRegister;
  onbuild: BuilderRegister;
}

export interface IRouteRunLifeCycle {
  onPipes: LifeCycleMethod[];
  onEnter: LifeCycleMethod[];
  onQuit: LifeCycleMethod[];
}

export interface IRouterLifeCycle extends IRouteRunLifeCycle {
  onCreate: ConstructorInitMethod[];
}

export type PipeErrorHandler = (error?: Error, msg?: string) => void;

export interface IPipeResolveContext {
  rules: Array<IPipeProcess>;
  handler?: PipeErrorHandler;
}

export interface IRouterMetaConfig {
  group: string;
  pipes?: IPipeResolveContext;
  register?(process: IRouterEvents): void;
}

export interface IRoutePathConfig {
  path: string | undefined;
  urlTpl: string | undefined;
  sections: { [key: string]: string };
}

export interface IRoute {
  name: Unsure<string>;
  method: METHOD[];
  path: Array<string>;
  pathConfig: Array<IRoutePathConfig>;
  pipes: IPipeResolveContext & { extend: boolean };
}

export interface IRouter {
  group: string;
  routes: MapLike<IRoute>;
  dependency: Map<Constructor<any>, string>;
  pipes: IPipeResolveContext;
  onBuild: Array<IRouterBuilderDefine>;
  lifeCycle: Partial<IRouterLifeCycle>;
}

export interface IRouteMiddlewareDefine {
  handler: PipeErrorHandler;
}

export interface IRouterMiddlewareDefine extends IRouteMiddlewareDefine {
  extend?: boolean;
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

export type RequestParamsInvokeFactory = (instance: IController) => () => any;
export type ResponseBodyInvokeFactory = (instance: IController) => <T>(code: any, msg: any, data: T) => any;

export interface BodyResolve {
  getQuery: RequestParamsInvokeFactory;
  getPost: RequestParamsInvokeFactory;
  toJson: ResponseBodyInvokeFactory;
}
