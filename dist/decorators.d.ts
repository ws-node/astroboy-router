import "reflect-metadata";
import { Constructor, METHOD, RouteFactory, IController, RouterFactory, AuthGuard, RouteAuthMetadata, MixinFactory } from "./metadata";
/**
 * ## 定义控制器Router
 * * 支持配置router的前缀
 * @description
 * @author Big Mogician
 * @param {string} prefix
 * @returns
 */
declare function RouterFactory(prefix: string): <T extends typeof IController>(target: T) => T;
/**
 * ## 为当前Router/Route绑定业务逻辑服务
 * * 业务逻辑服务名限定为`business`
 * * 服务在router初始化(`init`)后自动创建
 * @description
 * @author Big Mogician
 * @template S
 * @param {Constructor<S>} service
 * @returns
 */
declare function ServiceFactory<S>(service: Constructor<S>): MixinFactory;
/**
 * ## 定义路由方法
 * * 支持多路径
 * * 支持定义METHOD
 * * 区分Index和API
 * * Route不公开，做后续扩展支持
 * @description
 * @author Big Mogician
 * @param {METHOD} method
 * @param {string} path
 * @param {boolean} [inIndex]
 * @returns {RouteFactory}
 */
declare function RouteFactory(method: METHOD, path: string, inIndex?: boolean): RouteFactory;
declare function RouteFactory(method: METHOD, path: string[], isIndex?: boolean): RouteFactory;
/**
 * ## 定义Index页面
 * @description
 * @author Big Mogician
 * @param {string} path
 * @returns {RouteFactory}
 */
declare function IndexFactory(path: string): RouteFactory;
/**
 * ## 定义Index页面（多路由支持）
 * @description
 * @author Big Mogician
 * @param {string[]} path
 * @returns {RouteFactory}
 */
declare function IndexFactory(path: string[]): RouteFactory;
/**
 * ## 定义api
 * * api不支持多路由映射
 * @description
 * @author Big Mogician
 * @param {METHOD} method
 * @param {string} path
 * @returns {RouteFactory}
 */
declare function APIFactory(method: METHOD, path: string): RouteFactory;
/**
 * ## 路由元数据
 * * 目前支持为路由命名
 * @description
 * @author Big Mogician
 * @param {string} alias
 * @returns {RouteFactory}
 */
declare function MetadataFactory(alias: string): RouteFactory;
declare function AuthFactory(arr: AuthGuard[], metadata: RouteAuthMetadata): MixinFactory;
declare function AuthFactory(arr: AuthGuard[]): MixinFactory;
declare function InjectFactory<T = any>(): RouteFactory;
export { RouterFactory as Router, ServiceFactory as Service, IndexFactory as Index, APIFactory as API, MetadataFactory as Metadata, AuthFactory as Auth, AuthFactory as Authorize, InjectFactory as Inject };
