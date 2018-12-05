"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const utils_1 = require("./utils");
const service_factory_1 = require("./service.factory");
const auth_factory_1 = require("./auth.factory");
const get_1 = tslib_1.__importDefault(require("lodash/get"));
/**
 * 尝试有先从单url配置中读取api前缀
 * * 没有自定义，默认会使用高一级配置
 * @description
 * @author Big Mogician
 * @param {*} sections
 * @param {string} [apiPrefix]
 * @returns
 */
function getApiPrefix(sections, apiPrefix) {
    return get_1.default(sections, "api", undefined) || apiPrefix;
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
function decideTpl(defaultTuple, key, tpl) {
    return !tpl ? defaultTuple : key === 0 ? [tpl, defaultTuple[1]] : [defaultTuple[0], tpl];
}
function RouterFactory(...args) {
    const meta = args[0];
    const hasMetadata = typeof meta !== "string";
    const prefix = hasMetadata ? meta.prefix : meta;
    const apiPrefix = (hasMetadata ? meta.apiPrefix : undefined) || "api";
    // 初始化router默认url template
    const urlTpl = (hasMetadata ? meta.urlTpl : undefined);
    const routerTplTuple = [(urlTpl && urlTpl.index), (urlTpl && urlTpl.api)];
    return function router(target) {
        const router = utils_1.tryGetRouter(target.prototype);
        router.prefix = prefix;
        router.apiPrefix = apiPrefix;
        Object.keys(router.routes).forEach(key => {
            const route = router.routes[key];
            // 拷贝原始 url template
            const tplTuple = [...routerTplTuple];
            // 覆写当前路由的url template
            const tplKey = !route.index ? 1 : 0;
            if (!!route.urlTpl)
                tplTuple[tplKey] = route.urlTpl;
            route.path = route.pathConfig.map((p) => utils_1.routeConnect(prefix, getApiPrefix(p.sections, apiPrefix), p.path, route.index, decideTpl(tplTuple, tplKey, p.urlTpl), p.sections || {}));
        });
        if (hasMetadata) {
            const metadata = meta;
            if (!!metadata.business)
                service_factory_1.ServiceFactory(metadata.business)(target);
            if (!!metadata.auth) {
                const { rules, metadata: m } = metadata.auth;
                if (!m) {
                    auth_factory_1.AuthFactory(rules)(target);
                }
                else {
                    auth_factory_1.AuthFactory(rules, m)(target);
                }
            }
        }
        return (target);
    };
}
exports.RouterFactory = RouterFactory;
//# sourceMappingURL=router.factory.js.map