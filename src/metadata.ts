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

export enum ARGS {
  Params = "params",
  Query = "query",
  BodyAppJson = "body-application/json"
}

/** 未实现的路由方法 */
export type RouteMethod = () => any;

export type IPipeProcess<T = void> = (context: any) => Promise<T> | T;

export type ArgsResolver<T = any, R = any> = (source: T) => R;

export type ArgsFactory<T = any> = (target: T, propertyKey: string, index: number) => void;

export type ArgSolution = (context: IArgsSolutionsContext) => any;

export type ArgTransform = (arg: any) => any;

export interface IAstroboyBaseClass<T = any> {
  ctx: T;
}

export interface IRouteLifeCycleMethod {
  <T = any>(ctor: IAstroboyBaseClass<T>): void | Promise<void>;
}

export interface IRouterBuildContext<P = void> {
  router: IRouter<P>;
}

export interface IRouteBuildContext<P = void> extends IRouterBuildContext<P> {
  name: string;
  route: IRoute<P>;
}

export interface IRouteBuilderDefine<T = IRouteBuildContext<void>> {
  (context: T, prototype: any): void;
}

export interface IRouterCreateDefine<T = IRouterBuildContext<void>> {
  (context: T, prototype: any): void;
}

export type LifeCycleRegister = <K extends keyof IRouterLifeCycle>(
  name: K,
  resolver: K extends "onBuild" ? IRouteBuilderDefine : IRouteLifeCycleMethod,
  reset?: boolean
) => void;
export type OnCreateRegister = (resolver: IRouterCreateDefine, reset?: boolean) => void;

export interface IRouterEvents {
  lifecycle: LifeCycleRegister;
  create: OnCreateRegister;
}

export interface IRouteRunLifeCycle {
  onPipes: IRouteLifeCycleMethod[];
  onEnter: IRouteLifeCycleMethod[];
  onQuit: IRouteLifeCycleMethod[];
}

export interface IRouterLifeCycle extends IRouteRunLifeCycle {
  onBuild: IRouteBuilderDefine[];
}

export type PipeErrorHandler = (context: any, error?: Error) => void;

export interface IPipeResolveContext<T = void> {
  rules: Array<IPipeProcess<T>>;
  handler?: PipeErrorHandler;
}

export interface IRouterMetaConfig<P = void> {
  group?: string;
  pipes?: IPipeResolveContext<P>;
  extensions?: MapLike<any>;
  register?(process: IRouterEvents): void;
}

export interface IRoutePathConfig {
  path: string | undefined;
  urlTpl: string | undefined;
  sections: { [key: string]: string };
}

export interface IArgsOptions {
  transform: ArgsResolver;
  useStatic: boolean;
}

export interface IRouteArgument {
  type: ARGS;
  index: number;
  resolver?: ArgsResolver;
  static?: boolean;
  ctor?: any;
}

export interface IArgsSolutionsContext {
  body?: any;
  params?: any;
  query?: any;
}

export interface IRouteArguContent {
  hasArgs: boolean;
  context: {
    [index: number]: IRouteArgument;
  };
  maxIndex: number;
  solutions: Array<[ArgSolution, ArgTransform]>;
}

export interface IRoute<P = void> {
  resolved: boolean;
  name: Unsure<string>;
  method: METHOD[];
  path: Array<string>;
  pathConfig: Array<IRoutePathConfig>;
  pipes: IPipeResolveContext<P> & { extend: boolean };
  args: IRouteArguContent;
  extensions: MapLike<any>;
}

export interface IRouter<P = void> {
  group: string;
  routes: MapLike<IRoute>;
  dependency: Map<Constructor<any>, string>;
  pipes: IPipeResolveContext<P>;
  onCreate: Array<IRouterCreateDefine>;
  lifeCycle: Partial<IRouterLifeCycle>;
  extensions: MapLike<any>;
}

export interface IRoutePipeDefine {
  handler: PipeErrorHandler;
}

export interface IRouterPipeDefine extends IRoutePipeDefine {
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
