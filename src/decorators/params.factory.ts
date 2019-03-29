import { ArgsFactory, IArgsOptions, ARGS, InnerArgsOptions } from "../metadata";
import { tryGetRoute, tryGetRouter } from "./utils";

import "reflect-metadata";

/**
 * ## 从request中获取args
 * @description
 * @author Big Mogician
 * @export
 * @returns {FromParamsFactory}
 */
export function FromParamsFactory(): ArgsFactory;
export function FromParamsFactory(options: Partial<IArgsOptions<{ params?: any }>>): ArgsFactory;
export function FromParamsFactory(options: Partial<IArgsOptions<{ params?: any }>> = {}) {
  return FromRequestFactory({ ...options, type: ARGS.Params });
}

/**
 * ## 从request中获取queries
 * @description
 * @author Big Mogician
 * @export
 * @returns {FromQueryFactory}
 */
export function FromQueryFactory(): ArgsFactory;
export function FromQueryFactory(options: Partial<IArgsOptions<{ query?: any }>>): ArgsFactory;
export function FromQueryFactory(options: Partial<IArgsOptions<{ query?: any }>> = {}) {
  return FromRequestFactory({ ...options, type: ARGS.Query });
}

/**
 * ## 从request中获取body
 * * 默认为application/json
 * @description
 * @author Big Mogician
 * @export
 * @returns {FromBodyFactory}
 */
export function FromBodyFactory(): ArgsFactory;
export function FromBodyFactory(options: Partial<IArgsOptions<{ body?: any }>>): ArgsFactory;
export function FromBodyFactory(options: Partial<IArgsOptions<{ body?: any }>> = {}) {
  return FromRequestFactory({ ...options, useStrict: true, type: ARGS.BodyAppJson });
}

export function FromRequestFactory(): ArgsFactory;
export function FromRequestFactory(options: Partial<InnerArgsOptions>): ArgsFactory;
export function FromRequestFactory(options: Partial<InnerArgsOptions> = {}) {
  const { transform, useStatic = false, useStrict = false, type } = options;
  return function dynamic_args<T>(prototype: T, propertyKey: string, index: number) {
    const routes = tryGetRouter(prototype, "routes");
    const args = tryGetRoute(routes, propertyKey, "args");
    const types = Reflect.getMetadata("design:paramtypes", prototype, propertyKey) || [];
    if (index > args.maxIndex) args.maxIndex = index;
    args.context[index] = {
      index,
      type: type || ARGS.All,
      resolver: transform,
      static: !!useStatic,
      strict: !!useStrict,
      ctor: typeFilter(types[index])
    };
  };
}

function typeFilter(type: any) {
  switch (type) {
    case Object:
    case Array:
    case Symbol:
    case undefined:
    case null:
      return undefined;
    default:
      return type;
  }
}
