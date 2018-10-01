import { AuthGuard, IMixinFactory, RouteAuthMetadata, RouterDefine, IController, IRouteFactory } from "../metadata";
import { tryGetRouter, tryGetRoute } from "./utils";

/**
 * ## 为Router/Route定义鉴权逻辑
 * * 支持多个处理程序顺序执行
 * * 在任意一个处理程序失败后短路
 * @description
 * @author Big Mogician
 * @param {AuthGuard[]} guards
 * @returns {IMixinFactory}
 * @exports
 */
export function AuthFactory(guards: AuthGuard[]): IMixinFactory;
/**
 * ## 为Router/Route定义鉴权逻辑
 * * 支持多个处理程序顺序执行
 * * 在任意一个处理程序失败后短路
 * * 支持自定义通用错误信息
 * * 支持route继承
 * @description
 * @author Big Mogician
 * @param {AuthGuard[]} guards
 * @param {RouteAuthMetadata} metadata
 * @returns {IMixinFactory}
 * @exports
 */
export function AuthFactory(guards: AuthGuard[], metadata: RouteAuthMetadata): IMixinFactory;
export function AuthFactory(arr: AuthGuard[], metadata?: RouteAuthMetadata) {
  return function routeAuth(target: RouterDefine | typeof IController, propertyKey?: string, descriptor?: PropertyDescriptor) {
    const { extend, errorMsg, error } = metadata || { extend: true, errorMsg: undefined, error: undefined };
    if (propertyKey) {
      const { routes } = tryGetRouter(<RouterDefine>target);
      const route = tryGetRoute(routes, propertyKey);
      route.auth = {
        rules: arr,
        extend: extend === undefined ? true : !!extend,
        errorMsg: errorMsg || "Auth failed.",
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
  return function routeNoAuth(target: RouterDefine, propertyKey: string) {
    AuthFactory([], { extend: false })(target, propertyKey);
  };
}