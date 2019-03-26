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

export type METHOD = "GET" | "POST" | "PUT" | "DELETE";

/** 未实现的路由方法 */
export type RouteMethod = () => any;

export type CtxMiddleware = (context: any) => Promise<boolean | Error> | boolean | Error;

export type UrlTplTuple = [string | undefined, string | undefined];

export interface IAstroboyBaseClass<T = any> {
  ctx: T;
}

export interface IRouterMetaConfig<T = any> {
  prefix: string;
  apiPrefix?: string;
  business?: Constructor<T>;
  urlTpl?: {
    index?: string;
    api?: string;
  };
  auth?: {
    rules: CtxMiddleware[];
    metadata?: IRouterAuthMetadata;
  };
}

export interface IRoutePathConfig {
  isPlainUrl?: boolean;
  path: string;
  urlTpl?: string;
  sections: { [key: string]: string };
}

export interface IRoute<T = any> {
  name: Unsure<string>;
  method: METHOD[];
  path: Array<string>;
  pathConfig: Array<IRoutePathConfig>;
  index: boolean;
  service?: Constructor<T>;
  urlTpl?: string;
  auth: {
    rules: CtxMiddleware[];
    extend: boolean;
    errorMsg?: string;
    error?: any;
  };
}

export interface IRouter<T = any> {
  prefix: string;
  apiPrefix: string;
  service?: Constructor<T>;
  dependency: Map<Constructor<any>, string>;
  urlTpl: UrlTplTuple;
  auth: {
    rules: CtxMiddleware[];
    errorMsg?: string;
    error?: any;
  };
  routes: { [key: string]: IRoute };
}

export interface IRouterAuthMetadata {
  errorMsg?: string;
  error?: any;
}

export interface RouteAuthMetadata extends IRouterAuthMetadata {
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

type RequestParamsInvokeFactory = (instance: IController) => () => any;
type ResponseBodyInvokeFactory = (instance: IController) => <T>(code: any, msg: any, data: T) => any;

export interface BodyResolve {
  getQuery: RequestParamsInvokeFactory;
  getPost: RequestParamsInvokeFactory;
  toJson: ResponseBodyInvokeFactory;
}
