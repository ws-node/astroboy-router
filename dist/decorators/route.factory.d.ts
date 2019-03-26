import { METHOD, IRouteFactory } from "../metadata";
interface RouteOptions {
    /** 路由命名，实现@Metadata相同能力 */
    name: string;
    /** 重置当前路由模板 */
    tpl: string;
    /** 提供当前路由模板的参数 */
    sections?: {
        [key: string]: string;
    };
}
interface CustonRouteOptions {
    method: METHOD;
    tpls: (string | {
        tpl: string;
        sections?: {
            [key: string]: string;
        };
    })[];
    name?: string;
    isIndex?: boolean;
}
/**
 * ## 定义Index页面
 * @description
 * @author Big Mogician
 * @param {string} path
 * @param {Partial<RouteOptions>} [options=undefined]
 * @returns {IRouteFactory}
 * @exports
 */
export declare function IndexFactory(path: string, options?: Partial<RouteOptions>): IRouteFactory;
/**
 * ## 定义Index页面
 * * 多路由支持
 * @description
 * @author Big Mogician
 * @param {string[]} path
 * @param {Partial<RouteOptions>} [options=undefined]
 * @returns {IRouteFactory}
 * @exports
 */
export declare function IndexFactory(path: string[], options?: Partial<RouteOptions>): IRouteFactory;
/**
 * ## 定义api
 * @description
 * @author Big Mogician
 * @param {METHOD} method
 * @param {string} path
 * @param {Partial<RouteOptions>} [options=undefined]
 * @returns {IRouteFactory}
 * @exports
 */
export declare function APIFactory(method: METHOD, path: string, options?: Partial<RouteOptions>): IRouteFactory;
/**
 * ## 自定义的路由
 * @description
 * @author Big Mogician
 * @export
 * @param {CustonRouteOptions} options
 * @returns {IRouteFactory}
 * @exports
 */
export declare function CustomRouteFactory(options: CustonRouteOptions): IRouteFactory;
/**
 * #### deprecated : 使用@Index或者@API的最后一个options参数代替
 * ## 路由元数据
 * * 目前支持为路由命名
 * @deprecated
 * @description
 * @author Big Mogician
 * @param {string} alias
 * @returns {RouteFactory}
 * @exports
 */
export declare function MetadataFactory(alias: string): IRouteFactory;
export {};
