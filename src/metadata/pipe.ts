export type IPipeProcess<T = void> = (context: any) => Promise<T> | T;

export type PipeErrorHandler = (context: any, error?: Error) => void;

export interface IPipeResolveContext<T = void> {
  rules: Array<IPipeProcess<T>>;
  handler?: PipeErrorHandler;
}
