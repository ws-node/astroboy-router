export enum ARGS {
  All = "@all",
  Params = "params",
  Query = "query",
  BodyAppJson = "body::application/json",
  BodyUrlEncoded = "body::application/x-www-form-urlencoded",
  BodyFormData = "body::multipart/form-data"
}

/** 处理解析 */
export type ArgsResolver<T = any, R = any> = (source: T) => R;

export type ArgsFactory<T = any> = (target: T, propertyKey: string, index: number) => void;

export type ArgsDecision = (context: IArgsSolutionsContext) => any;

export interface IArgsSolutionsContext {
  body?: any;
  params?: any;
  query?: any;
}

export interface IArgsOptions<TRANS = any, RESULT = any> {
  transform: ArgsResolver<TRANS, RESULT>;
  useStatic: boolean;
  useStrict: boolean;
}

export interface IAllArgsOptions extends IArgsOptions<IArgsSolutionsContext, any> {
  type: ARGS.All;
}

export interface IQueryArgsOptions extends IArgsOptions<{ query?: any }, any> {
  type: ARGS.Query;
}

export interface IParamsArgsOptions extends IArgsOptions<{ params?: any }, any> {
  type: ARGS.Params;
}

export interface IBodyArgsOptions extends IArgsOptions<{ body?: any }, any> {
  type: ARGS.BodyAppJson | ARGS.BodyFormData | ARGS.BodyUrlEncoded;
}

export type InnerArgsOptions = IAllArgsOptions | IQueryArgsOptions | IParamsArgsOptions | IBodyArgsOptions;

export interface IRouteArgument {
  type: ARGS;
  index: number;
  resolver?: ArgsResolver;
  static?: boolean;
  strict?: boolean;
  ctor?: any;
}

export interface IRouteArguContent {
  hasArgs: boolean;
  context: {
    [index: number]: IRouteArgument;
  };
  maxIndex: number;
  solutions: Array<[ArgsDecision, ArgsResolver]>;
}
