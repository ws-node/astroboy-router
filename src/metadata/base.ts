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

export interface IRoutePathConfig {
  path: string | undefined;
  urlTpl: string | undefined;
  sections: { [key: string]: string };
}

export interface IRoutePipeDefine {
  handler: PipeErrorHandler;
}

export interface IRouterPipeDefine extends IRoutePipeDefine {
  extend?: boolean;
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

export interface IRouterMetaConfig<P = void> {
  group?: string;
  pipes?: IPipeResolveContext<P>;
  extensions?: MapLike<any>;
  register?(process: IRouterEvents): void;
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
