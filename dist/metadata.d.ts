/**
 * 表示当前属性或变量的值必然不为undefined
 * * 如果当前字段类型不含null并且字段非可选，则无需进行空值检测
 * * 配合TS的strickNullCheck使用
 */
declare type Exist<T> = Exclude<T, undefined>;
/** 明确表示当前目标可能为undefined */
declare type Unsure<T> = Exist<T> | undefined;
export interface Constructor<T> {
    new (...args: any[]): T;
}
export declare type METHOD = "GET" | "POST" | "PUT" | "DELETE";
/** 未实现的路由方法 */
export declare type RouteMethod = () => any;
export declare type AuthGuard = (context: any) => Promise<boolean | Error> | boolean | Error;
export declare type UrlTplTuple = [string | undefined, string | undefined];
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
        rules: AuthGuard[];
        metadata?: RouterAuthMetadata;
    };
}
export interface RoutePathConfig {
    isPlainUrl?: boolean;
    path: string;
    urlTpl?: string;
    sections: {
        [key: string]: string;
    };
}
export interface Route<T = any> {
    name: Unsure<string>;
    method: METHOD[];
    path: Array<string>;
    pathConfig: Array<RoutePathConfig>;
    index: boolean;
    service?: Constructor<T>;
    urlTpl?: string;
    auth: {
        rules: AuthGuard[];
        extend: boolean;
        errorMsg: string;
        error?: any;
    };
}
export interface Router<T = any> {
    prefix: string;
    apiPrefix: string;
    service?: Constructor<T>;
    dependency: Map<Constructor<any>, string>;
    urlTpl: UrlTplTuple;
    auth: {
        rules: AuthGuard[];
        errorMsg: string;
        error?: any;
    };
    routes: {
        [key: string]: Route;
    };
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
export declare type RouterPrototype<T = {}> = T & RouterDefine;
export interface ControllerConstructor<T = any> {
    prototype: RouterPrototype<T>;
}
export declare abstract class IController implements IAstroboyBaseClass {
    [key: string]: any;
    ctx: any;
}
export declare type IRouteFactory = <T>(target: T, propertyKey: string, descriptor?: PropertyDescriptor) => any;
export declare type IRouterFactory = <T>(target: T) => any;
export declare type IMixinFactory = <T>(target: T, propertyKey?: string) => any;
declare type RequestParamsInvokeFactory = (instance: IController) => (() => any);
declare type ResponseBodyInvokeFactory = (instance: IController) => (<T>(code: any, msg: any, data: T) => any);
export interface BodyResolve {
    getQuery: RequestParamsInvokeFactory;
    getPost: RequestParamsInvokeFactory;
    toJson: ResponseBodyInvokeFactory;
}
export {};
