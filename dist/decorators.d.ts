import "reflect-metadata";
import { Constructor, METHOD, AuthGuard, RouteAuthMetadata, IMixinFactory, IRouteFactory, IRouterFactory, IRouterMetaConfig } from "./metadata";
/**
 * ## 定义控制器Router
 * * 支持配置router的前缀
 * @description
 * @author Big Mogician
 * @param {string} prefix
 * @returns {IRouterFactory}
 */
declare function RouterFactory(prefix: string): IRouterFactory;
/**
 * ## 定义控制器Router
 * * 配置router的前缀
 * * 配置router的api前缀
 * * 配置router的business服务
 * * 配置router的authorize
 * @description
 * @author Big Mogician
 * @template S
 * @param {IRouterMetaConfig<S>} metadata
 * @returns {IRouterFactory}
 */
declare function RouterFactory<S>(metadata: IRouterMetaConfig<S>): IRouterFactory;
/**
 * ## 为当前Router/Route绑定业务逻辑服务
 * * 业务逻辑服务名限定为`business`
 * * 服务在router初始化(`init`)后自动创建
 * @description
 * @author Big Mogician
 * @template S
 * @param {Constructor<S>} service
 * @returns {IMixinFactory}
 */
declare function ServiceFactory<S>(service: Constructor<S>): IMixinFactory;
/**
 * ## 定义Index页面
 * @description
 * @author Big Mogician
 * @param {string} path
 * @returns {IRouteFactory}
 */
declare function IndexFactory(path: string): IRouteFactory;
/**
 * ## 定义Index页面
 * * 多路由支持
 * @description
 * @author Big Mogician
 * @param {string[]} path
 * @returns {IRouteFactory}
 */
declare function IndexFactory(path: string[]): IRouteFactory;
/**
 * ## 定义api
 * * api不支持多路由映射
 * @description
 * @author Big Mogician
 * @param {METHOD} method
 * @param {string} path
 * @returns {IRouteFactory}
 */
declare function APIFactory(method: METHOD, path: string): IRouteFactory;
/**
 * ## 路由元数据
 * * 目前支持为路由命名
 * @description
 * @author Big Mogician
 * @param {string} alias
 * @returns {RouteFactory}
 */
declare function MetadataFactory(alias: string): IRouteFactory;
/**
 * ## 为Router/Route定义鉴权逻辑
 * * 支持多个处理程序顺序执行
 * * 在任意一个处理程序失败后短路
 * @description
 * @author Big Mogician
 * @param {AuthGuard[]} guards
 * @returns {IMixinFactory}
 */
declare function AuthFactory(guards: AuthGuard[]): IMixinFactory;
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
 */
declare function AuthFactory(guards: AuthGuard[], metadata: RouteAuthMetadata): IMixinFactory;
/**
 * ## 清空当前route的鉴权
 * * 配合`@Authorize()`使用
 * @description
 * @author Big Mogician
 * @returns {IRouteFactory}
 */
declare function NoAuthFactory(): IRouteFactory;
/**
 * ## 为Router注入服务
 * * 延迟初始化：注入的服务会在第一次访问时初始化
 * * 同路由中多次访问同一服务，服务保持单例状态
 * * ⚠️ 确保仅在Typescript环境使用此装饰器
 * * ⚠️ 确保开启`tsconfig.json`中的`emitDecoratorMetadata`选项
 * @description
 * @author Big Mogician
 * @template T
 * @returns {IRouteFactory}
 */
declare function InjectFactory<T = any>(): IRouteFactory;
export { RouterFactory as Router, ServiceFactory as Service, IndexFactory as Index, APIFactory as API, MetadataFactory as Metadata, AuthFactory as Auth, AuthFactory as Authorize, NoAuthFactory as NoAuthorize, InjectFactory as Inject };
