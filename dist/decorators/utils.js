"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
/**
 * ## 获取router配置参数
 * * 如果是第一次配置，先做存储
 * @description
 * @author Big Mogician
 * @param {(RouterDefine | IController)} target 控制器原型
 * @returns
 * @exports
 */
function tryGetRouter(target) {
    const routerSaved = core_1.RouterMap.get(target);
    let router;
    router = routerSaved;
    if (!routerSaved) {
        router = {
            prefix: "",
            apiPrefix: "api",
            routes: {},
            dependency: new Map(),
            urlTpl: [undefined, undefined],
            auth: {
                rules: [],
                errorMsg: "Auth failed."
            }
        };
        core_1.RouterMap.set(target, router);
    }
    target["@router"] = router;
    return router;
}
exports.tryGetRouter = tryGetRouter;
/**
 * ## 获取route配置参数
 * * 如果是第一次配置当前路由项，先做初始化
 * @description
 * @author Big Mogician
 * @param {{ [key: string]: Route }} routes
 * @param {string} key
 * @returns
 * @exports
 */
function tryGetRoute(routes, key) {
    let route = routes[key];
    if (!route) {
        route = routes[key] = {
            name: undefined,
            method: [],
            path: [],
            pathConfig: [],
            index: false,
            urlTpl: undefined,
            auth: {
                rules: [],
                extend: true,
                errorMsg: "Auth failed."
            }
        };
    }
    return route;
}
exports.tryGetRoute = tryGetRoute;
/**
 * ## 连接路由
 * * 连接router前缀和path
 * * API路由在前缀和路由根之间插入`api`层级
 * @description
 * @author Big Mogician
 * @param {string} prefix
 * @param {string} apiPrefix
 * @param {string} pathStr
 * @param {boolean} isIndex
 * @param {UrlTplTuple} tpl
 * @param {{ [key: string]: string }} tplSections
 * @returns
 * @exports
 */
function routeConnect(prefix, apiPrefix, pathStr, isIndex, tpl, tplSections) {
    const splits = [];
    const [indexTpl, apiTpl] = tpl || [undefined, undefined];
    // 没有重置模版，不要进入逻辑分支
    if (!!indexTpl || !!apiTpl) {
        const sections = Object.assign({ prefix, api: apiPrefix, path: pathStr }, tplSections);
        if (!isIndex)
            sections.api = sections.api;
        let urlToExport = (!!isIndex ? indexTpl : apiTpl) || "";
        Object.keys(sections).forEach(key => {
            const placeholder = "{{@" + key + "}}";
            if (urlToExport.includes(placeholder)) {
                const realValue = sections[key];
                if (realValue === "" || realValue === undefined) {
                    // 去掉当前section
                    urlToExport = urlToExport.replace(`/${placeholder}`, "");
                }
                else if (realValue === "&nbsp;") {
                    // 明确需要保留当前section，场景应该比较少
                    urlToExport = urlToExport.replace(placeholder, "");
                }
                else {
                    // 正常替换section模板
                    urlToExport = urlToExport.replace(placeholder, realValue);
                }
            }
        });
        return urlToExport;
    }
    // 默认的url拼装逻辑
    // 事实上等效："{{@prefix}}/{{@path}}" 和 "api/{{@prefix}}/{{@path}}"
    if (!isIndex)
        splits.push(apiPrefix);
    if (prefix !== "")
        splits.push(prefix);
    if (!!pathStr)
        splits.push(pathStr);
    return splits.join("/");
}
exports.routeConnect = routeConnect;
//# sourceMappingURL=utils.js.map