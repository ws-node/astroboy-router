import { CtxMiddleware, IMixinFactory, RouteAuthMetadata, IRouterDefine, IController, IRouteFactory } from "../metadata";
import { tryGetRouter, tryGetRoute } from "./utils";

/**
 * ## 为Router/Route定义鉴权逻辑
 * * 支持多个处理程序顺序执行
 * * 在任意一个处理程序失败后短路
 * @description
 * @author Big Mogician
 * @param {CtxMiddleware[]} guards
 * @returns {IMixinFactory}
 * @exports
 */
export function AuthFactory(guards: CtxMiddleware[]): IMixinFactory;
/**
 * ## 为Router/Route定义鉴权逻辑
 * * 支持多个处理程序顺序执行
 * * 在任意一个处理程序失败后短路
 * * 支持自定义通用错误信息
 * * 支持route继承
 * @description
 * @author Big Mogician
 * @param {CtxMiddleware[]} guards
 * @param {RouteAuthMetadata} metadata
 * @returns {IMixinFactory}
 * @exports
 */
export function AuthFactory(guards: CtxMiddleware[], metadata: RouteAuthMetadata): IMixinFactory;
export function AuthFactory(arr: CtxMiddleware[], metadata: RouteAuthMetadata = {}) {
  return function routeAuth(target: IRouterDefine | typeof IController, propertyKey?: string, descriptor?: PropertyDescriptor) {
    const { extend = true, errorMsg, error } = metadata;
    if (propertyKey) {
      const { routes } = tryGetRouter(<IRouterDefine>target);
      const route = tryGetRoute(routes, propertyKey);
      route.auth = {
        rules: arr,
        extend: !!extend,
        errorMsg,
        error
      };
    } else {
      const router = tryGetRouter((<typeof IController>target).prototype);
      router.auth = {
        rules: arr,
        errorMsg: errorMsg || "Auth failed.",
        error
      };
    }
  };
}

/**
 * ## 清空当前route的鉴权
 * * 配合`@Authorize()`使用
 * @description
 * @author Big Mogician
 * @returns {IRouteFactory}
 * @exports
 */
export function NoAuthFactory(): IRouteFactory;
export function NoAuthFactory() {
  return function routeNoAuth(target: IRouterDefine, propertyKey: string) {
    AuthFactory([], { extend: false })(target, propertyKey);
  };
}
