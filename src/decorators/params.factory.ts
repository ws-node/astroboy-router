import { ArgsFactory, IArgsOptions, ARGS } from "../metadata";
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
export function FromParamsFactory(options: Partial<IArgsOptions>): ArgsFactory;
export function FromParamsFactory(options: Partial<IArgsOptions> = {}) {
  return BaseArgsFactory(ARGS.Params, options);
}

/**
 * ## 从request中获取queries
 * @description
 * @author Big Mogician
 * @export
 * @returns {FromQueryFactory}
 */
export function FromQueryFactory(): ArgsFactory;
export function FromQueryFactory(options: Partial<IArgsOptions>): ArgsFactory;
export function FromQueryFactory(options: Partial<IArgsOptions> = {}) {
  return BaseArgsFactory(ARGS.Query, options);
}

/**
 * ## 从request中获取body
 * @description
 * @author Big Mogician
 * @export
 * @returns {FromBodyFactory}
 */
export function FromBodyFactory(): ArgsFactory;
export function FromBodyFactory(options: Partial<IArgsOptions>): ArgsFactory;
export function FromBodyFactory(options: Partial<IArgsOptions> = {}) {
  return BaseArgsFactory(ARGS.BodyAppJson, options);
}

function BaseArgsFactory(type: ARGS): ArgsFactory;
function BaseArgsFactory(type: ARGS, options: Partial<IArgsOptions>): ArgsFactory;
function BaseArgsFactory(type: ARGS, options: Partial<IArgsOptions> = {}) {
  const { transform, useStatic } = options;
  return function dynamic_args<T>(prototype: T, propertyKey: string, index: number) {
    const routes = tryGetRouter(prototype, "routes");
    const args = tryGetRoute(routes, propertyKey, "args");
    const types = Reflect.getMetadata("design:paramtypes", prototype, propertyKey) || [];
    if (index > args.maxIndex) args.maxIndex = index;
    args.context[index] = {
      index,
      type,
      resolver: transform,
      static: !!useStatic,
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
