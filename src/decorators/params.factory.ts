import { ArgsFactory, IArgsOptions, ARGS } from "../metadata";
import { tryGetRoute } from "./utils";

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
  return BaseArgsFactory("params", options);
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
  return BaseArgsFactory("query", options);
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
  return BaseArgsFactory("body", options);
}

function BaseArgsFactory(type: ARGS): ArgsFactory;
function BaseArgsFactory(type: ARGS, options: Partial<IArgsOptions>): ArgsFactory;
function BaseArgsFactory(type: ARGS, options: Partial<IArgsOptions> = {}) {
  const { transform, useStatic } = options;
  return function dynamic_args<T>(prototype: T, propertyKey: string, index: number) {
    const args = tryGetRoute(prototype, propertyKey, "args");
    const types = Reflect.getMetadata("design:paramtypes", prototype, propertyKey) || [];
    args.queue.push({
      index,
      type,
      resolver: transform,
      static: !!useStatic,
      ctor: typeFilter(types[index])
    });
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
