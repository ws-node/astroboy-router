/// <reference types="astroboy"/>
import { BaseClass } from "astroboy";

/**
 * 表示当前属性或变量的值必然不为undefined
 * * 如果当前字段类型不含null并且字段非可选，则无需进行空值检测
 * * 配合TS的strickNullCheck使用
 */
type Exist<T> = Exclude<T, undefined>;
/** 明确表示当前目标可能为undefined */
type Unsure<T> = Exist<T> | undefined;
export interface Constructor<T> {
  new(...args: any[]): T;
}

export type METHOD = "GET" | "POST" | "PUT" | "DELETE";

/** 未实现的路由方法 */
export type RouteMethod = () => any;

export type AuthGuard = (context: AstroboyContext) => Promise<boolean> | boolean;

export interface Route<T = any> {
  name: Unsure<string>;
  method: METHOD;
  path: string | Array<string>;
  index: boolean;
  service?: Constructor<T>;
  auth: {
    rules: AuthGuard[];
    extend: boolean;
    errorMsg: string;
    error?: any;
  };
}

export interface Router<T = any> {
  prefix: string;
  service?: Constructor<T>;
  dependency: Map<Constructor<any>, string>;
  auth: {
    rules: AuthGuard[];
    errorMsg: string;
    error?: any;
  };
  routes: { [key: string]: Route };
}

export interface RouterAuthMetadata {
  errorMsg?: string;
  error?: any;
}

export interface RouteAuthMetadata extends RouterAuthMetadata {
  extend?: boolean;
}

export interface RouterDefine {
  "@router"?: Router;
}

export type RouterPrototype<T = {}> = T & RouterDefine;

export interface ControllerConstructor<T = any> {
  prototype: RouterPrototype<T>;
}

export abstract class IController extends BaseClass {
  [key: string]: any;
}

export type RouteFactory = <T>(target: T, propertyKey: string, descriptor?: PropertyDescriptor) => any;
export type RouterFactory = <T>(target: T) => any;
export type MixinFactory = <T>(target: T, propertyKey?: string) => any;

type RequestParamsInvokeFactory = (instance: BaseClass) => (() => any);
type ResponseBodyInvokeFactory = (instance: BaseClass) => (<T>(code: any, msg: any, data: T) => any);

export interface BodyResolve {
  getQuery: RequestParamsInvokeFactory;
  getPost: RequestParamsInvokeFactory;
  toJson: ResponseBodyInvokeFactory;
}