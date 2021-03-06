import { MapLike, Constructor } from "./base";

export enum ARGS {
  All = "@all",
  Custom = "@custom",
  Params = "params",
  Query = "query",
  BodyAppJson = "body::application/json",
  BodyUrlEncoded = "body::application/x-www-form-urlencoded",
  BodyFormData = "body::multipart/form-data",
}

export type ArgsFactory<T = any> = (target: T, propertyKey: string, index: number) => void;

/** Args提取函数，决定提取哪一部分的args */
export type ArgsExtraction = (context: IArgSolutionsContext) => any;

/** Args转换解析，决定如何处理当前args */
export type ArgsTransform<T = any, R = any> = (source: T) => R;

/** Args静态类型转换，决定如何处理静态类型对象反序列化 */
export type ArgsResolveStatic<T = any, OPTIONS = {}> = (data: any, options?: { type: T } & OPTIONS) => any;

/**
 * ## Args上下文
 *
 * @author Big Mogician
 * @export
 * @interface IArgsSolutionsContext
 */
export interface IArgSolutionsContext {
  context: MapLike<any>;
  body: MapLike<any>;
  params: MapLike<any>;
  query: MapLike<any>;
}

/**
 * ## Args装饰器配置
 *
 * @author Big Mogician
 * @export
 * @interface IArgsOptions
 * @template TRANS
 * @template RESULT
 * @template SOPTIONS
 */
export interface IArgsOptions<TRANS = any, RESULT = any, SOPTIONS = {}> {
  /** 自定义args转换，默认：`undefined` */
  transform: ArgsTransform<TRANS, RESULT>;
  /** 使用静态类型处理函数，默认：`undefined` */
  useStatic: ArgsResolveStatic<RESULT, SOPTIONS>;
  /** 使用指定的类型覆盖类型声明 ， 默认：`undefined` */
  useTypes: Array<Constructor<any>>;
}

/**
 * ## Request-Args装饰器配置
 *
 * @author Big Mogician
 * @export
 * @interface IRequestArgsOptions
 * @extends {IArgsOptions<IArgSolutionsContext>}
 */
export interface IRequestArgsOptions extends IArgsOptions<IArgSolutionsContext> {
  /** 自定义args提取，默认：`undefined` */
  extract: ArgsExtraction;
  /** 使用严格数值模式，默认：`false` */
  useStrict: boolean;
  /** args类型，默认：`ARGS.Custom` */
  type: ARGS;
}

export interface IAllArgsOptions extends IArgsOptions<IArgSolutionsContext, any> {
  type: ARGS.All;
}

export interface IQueryArgsOptions extends IArgsOptions<any, any> {
  type: ARGS.Query;
}

export interface IParamsArgsOptions extends IArgsOptions<any, any> {
  type: ARGS.Params;
}

export interface IBodyArgsOptions extends IArgsOptions<any, any> {
  type: ARGS.BodyAppJson | ARGS.BodyFormData | ARGS.BodyUrlEncoded;
}

export type InnerArgsOptions = IAllArgsOptions | IQueryArgsOptions | IParamsArgsOptions | IBodyArgsOptions;

export interface IRouteArgument {
  /** args类型，默认：`ARGS.ALL` */
  type: ARGS;
  /** args在函数的索引，默认：`-1` */
  index: number;
  /** args的提取函数，默认：`context => context` */
  extract?: ArgsExtraction;
  /** args的转换函数，默认：`data => data` */
  transform?: ArgsTransform;
  /** args的静态类型处理函数，默认：`data => data` */
  static?: ArgsResolveStatic;
  /** args的严格模式，兼容url-encoded的类型模糊问题，默认：`false` */
  strict?: boolean;
  /** args的类型，默认：`undefined` */
  ctor?: Array<Constructor<any>>;
}

export interface IBaseStaticResolveOptions<T = any> extends Partial<IParseArgsOptions> {
  type: T[];
}

export interface IArgSolutionPack<SOURCE = any, TYPE = any, OPTIONS extends IBaseStaticResolveOptions<TYPE> = any> {
  extract: ArgsExtraction;
  transform: ArgsTransform<SOURCE, TYPE>;
  static?: ArgsResolveStatic<TYPE, OPTIONS>;
  type?: TYPE[];
}

export interface IRouteArguContent {
  /** 是否进行参数解析：默认：`false` */
  hasArgs: boolean;
  /** 参数上下文集合，默认：`{}` */
  context: {
    [index: number]: IRouteArgument;
  };
  /** 最大参数索引，默认：`-1` */
  maxIndex: number;
  /** args解决方案，默认：`[]` */
  solutions: Array<IArgSolutionPack>;
}

export interface IParseArgsOptions {
  fetchArgs(delegator: any): IArgSolutionsContext;
  [prop: string]: any;
}
