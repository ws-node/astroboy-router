import { AuthGuard, IMixinFactory, RouteAuthMetadata, IRouteFactory } from "../metadata";
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
export declare function AuthFactory(guards: AuthGuard[]): IMixinFactory;
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
export declare function AuthFactory(guards: AuthGuard[], metadata: RouteAuthMetadata): IMixinFactory;
/**
 * ## 清空当前route的鉴权
 * * 配合`@Authorize()`使用
 * @description
 * @author Big Mogician
 * @returns {IRouteFactory}
 * @exports
 */
export declare function NoAuthFactory(): IRouteFactory;
