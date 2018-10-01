import { METHOD, IRouteFactory } from "../metadata";
/**
 * ## 定义Index页面
 * @description
 * @author Big Mogician
 * @param {string} path
 * @returns {IRouteFactory}
 * @exports
 */
export declare function IndexFactory(path: string): IRouteFactory;
/**
 * ## 定义Index页面
 * * 多路由支持
 * @description
 * @author Big Mogician
 * @param {string[]} path
 * @returns {IRouteFactory}
 * @exports
 */
export declare function IndexFactory(path: string[]): IRouteFactory;
/**
 * ## 定义api
 * * api不支持多路由映射
 * @description
 * @author Big Mogician
 * @param {METHOD} method
 * @param {string} path
 * @returns {IRouteFactory}
 * @exports
 */
export declare function APIFactory(method: METHOD, path: string): IRouteFactory;
/**
 * ## 路由元数据
 * * 目前支持为路由命名
 * @description
 * @author Big Mogician
 * @param {string} alias
 * @returns {RouteFactory}
 * @exports
 */
export declare function MetadataFactory(alias: string): IRouteFactory;
