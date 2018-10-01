import { IRouterFactory, IRouterMetaConfig, IController, UrlTplTuple } from "../metadata";
import { tryGetRouter, routeConnect } from "./utils";
import { ServiceFactory } from "./service.factory";
import { AuthFactory } from "./auth.factory";
import get from "lodash/get";

/**
 * 尝试有先从单url配置中读取api前缀
 * * 没有自定义，默认会使用高一级配置
 * @description
 * @author Big Mogician
 * @param {*} sections
 * @param {string} [apiPrefix]
 * @returns
 */
function getApiPrefix(sections: any, apiPrefix?: string) {
  return get(sections, "api", undefined) || apiPrefix;
}

/**
 * 尝试优先使用url配置的url template
 * * 没有自定义，默认会使用高一级配置
 * @description
 * @author Big Mogician
 * @param {UrlTplTuple} defaultTuple
 * @param {(0 | 1)} key
 * @param {string} [tpl]
 * @returns {UrlTplTuple}
 */
function decideTpl(defaultTuple: UrlTplTuple, key: 0 | 1, tpl?: string): UrlTplTuple {
  return !tpl ? defaultTuple : key === 0 ? [tpl, defaultTuple[1]] : [defaultTuple[0], tpl];
}

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
  const routerTplTuple: UrlTplTuple = [(urlTpl && urlTpl.index), (urlTpl && urlTpl.api)];
  return function router<T extends typeof IController>(target: T) {
    const router = tryGetRouter(target.prototype);
    router.prefix = prefix;
    router.apiPrefix = apiPrefix;
    Object.keys(router.routes).forEach(key => {
      const route = router.routes[key];
      // 拷贝原始 url template
      const tplTuple: UrlTplTuple = <any>[...routerTplTuple];
      // 覆写当前路由的url template
      const tplKey = !route.index ? 1 : 0;
      if (!!route.urlTpl) tplTuple[tplKey] = route.urlTpl;
      route.path = route.pathConfig.map(p => routeConnect(
        prefix,
        getApiPrefix(p.sections, apiPrefix),
        p.path,
        route.index,
        decideTpl(tplTuple, tplKey, p.urlTpl),
        p.sections || {}),
      );
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