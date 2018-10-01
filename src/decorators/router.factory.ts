import { IRouterFactory, IRouterMetaConfig, IController, UrlTplTuple } from "../metadata";
import { tryGetRouter, routeConnect } from "./utils";
import { ServiceFactory } from "./service.factory";
import { AuthFactory } from "./auth.factory";


/**
 * ## 定义控制器Router
 * * 支持配置router的前缀
 * @description
 * @author Big Mogician
 * @param {string} prefix
 * @returns {IRouterFactory}
 * @exports
 */
export function RouterFactory(prefix: string): IRouterFactory;
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
export function RouterFactory<S>(metadata: IRouterMetaConfig<S>): IRouterFactory;
export function RouterFactory(...args: any[]) {
  const meta = args[0];
  const hasMetadata = typeof meta !== "string";
  const prefix = hasMetadata ? (<IRouterMetaConfig>meta).prefix : <string>meta;
  const apiPrefix = (hasMetadata ? (<IRouterMetaConfig>meta).apiPrefix : undefined) || "api";
  // 初始化router默认url template
  const urlTpl = (hasMetadata ? (<IRouterMetaConfig>meta).urlTpl : undefined);
  const tplTuple: UrlTplTuple = [(urlTpl && urlTpl.index), (urlTpl && urlTpl.api)];
  return function router<T extends typeof IController>(target: T) {
    const router = tryGetRouter(target.prototype);
    router.prefix = prefix;
    router.apiPrefix = apiPrefix;
    Object.keys(router.routes).forEach(key => {
      const route = router.routes[key];
      // 覆写当前路由的url template
      const tplKey = !route.index ? 1 : 0;
      if (!!router.urlTpl) tplTuple[tplKey] = route.urlTpl;
      if (route.path instanceof Array) {
        route.path = route.path.map(path => routeConnect(prefix, apiPrefix, path, route.index, tplTuple));
      } else {
        route.path = routeConnect(prefix, apiPrefix, route.path, route.index, tplTuple);
      }
    });
    if (hasMetadata) {
      const metadata = <IRouterMetaConfig>meta;
      if (!!metadata.business) ServiceFactory(metadata.business)(target);
      if (!!metadata.auth) {
        const { rules, metadata: m } = metadata.auth;
        if (!m) {
          AuthFactory(rules)(target);
        } else {
          AuthFactory(rules, m)(target);
        }
      }
    }
    return <T>(target);
  };
}