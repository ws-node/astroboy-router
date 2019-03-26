import { CtxMiddleware, IMixinFactory, IRouterMiddlewareDefine, IRouterDefine, IController, IRouteFactory } from "../metadata";
import { tryGetRouter, tryGetRoute } from "./utils";

/**
 * ## 为Router/Route定义Middleware逻辑
 * * 支持多个处理程序顺序执行
 * * 在任意一个处理程序失败后短路
 * @description
 * @author Big Mogician
 * @param {CtxMiddleware[]} middlewares
 * @returns {IMixinFactory}
 * @exports
 */
export function MiddlewareFactory(middlewares: CtxMiddleware[]): IMixinFactory;
/**
 * ## 为Router/Route定义Middleware逻辑
 * * 支持多个处理程序顺序执行
 * * 在任意一个处理程序失败后短路
 * * 支持自定义通用错误信息
 * * 支持route继承
 * @description
 * @author Big Mogician
 * @param {CtxMiddleware[]} middlewares
 * @param {IRouterMiddlewareDefine} metadata
 * @returns {IMixinFactory}
 * @exports
 */
export function MiddlewareFactory(middlewares: CtxMiddleware[], metadata: IRouterMiddlewareDefine): IMixinFactory;
export function MiddlewareFactory(middlewares: CtxMiddleware[], metadata: IRouterMiddlewareDefine = {}) {
  return function routeAuth(target: IRouterDefine | typeof IController, propertyKey?: string, descriptor?: PropertyDescriptor) {
    const { extend = true, errorMsg, error } = metadata;
    if (propertyKey) {
      const { routes } = tryGetRouter(<IRouterDefine>target);
      const route = tryGetRoute(routes, propertyKey);
      route.auth = {
        rules: middlewares,
        extend: !!extend,
        errorMsg,
        error
      };
    } else {
      const router = tryGetRouter((<typeof IController>target).prototype);
      router.auth = {
        rules: middlewares,
        errorMsg: errorMsg || "Middleware failed.",
        error
      };
    }
  };
}

/**
 * ## 清空当前route的Middlewares
 * * 配合`@Middlewares()`使用
 * @description
 * @author Big Mogician
 * @returns {IRouteFactory}
 * @exports
 */
export function NoMiddlewareFactory(): IRouteFactory;
export function NoMiddlewareFactory() {
  return function routeNoAuth(target: IRouterDefine, propertyKey: string) {
    MiddlewareFactory([], { extend: false })(target, propertyKey);
  };
}
