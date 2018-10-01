import { IRouterFactory, IRouterMetaConfig } from "../metadata";
/**
 * ## 定义控制器Router
 * * 支持配置router的前缀
 * @description
 * @author Big Mogician
 * @param {string} prefix
 * @returns {IRouterFactory}
 * @exports
 */
export declare function RouterFactory(prefix: string): IRouterFactory;
/**
 * ## 定义控制器Router
 * * 配置router的前缀
 * * 配置router的api前缀
 * * 配置router的business服务
 * * 配置router的authorize
 * * 配置router的url template
 * @description
 * @author Big Mogician
 * @template S
 * @param {IRouterMetaConfig<S>} metadata
 * @returns {IRouterFactory}
 * @exports
 */
export declare function RouterFactory<S>(metadata: IRouterMetaConfig<S>): IRouterFactory;
