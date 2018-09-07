"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("./core");
/**
 * ## 获取router配置参数
 * * 如果是第一次配置，先做存储
 * @description
 * @author Big Mogician
 * @param {(RouterDefine | IController)} target 控制器原型
 * @returns
 */
function tryGetRouter(target) {
    const routerSaved = core_1.RouterMap.get(target);
    let router;
    router = routerSaved;
    if (!routerSaved) {
        router = {
            prefix: "",
            routes: {},
            dependency: new Map(),
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
/**
 * ## 获取route配置参数
 * * 如果是第一次配置当前路由项，先做初始化
 * @description
 * @author Big Mogician
 * @param {{ [key: string]: Route }} routes
 * @param {string} key
 * @returns
 */
function tryGetRoute(routes, key) {
    let route = routes[key];
    if (!route) {
        route = routes[key] = {
            name: undefined,
            method: "GET",
            path: "",
            index: false,
            auth: {
                rules: [],
                extend: true,
                errorMsg: "Auth failed."
            }
        };
    }
    return route;
}
/**
 * ## 连接路由
 * * 连接router前缀和path
 * * API路由在前缀和路由根之间插入`api`层级
 * @description
 * @author Big Mogician
 * @param {string} prefix
 * @param {string} pathStr
 * @param {boolean} isIndex
 * @returns
 */
function routeConnect(prefix, pathStr, isIndex) {
    return `${!isIndex ? "api/" : ""}${prefix}${!!pathStr ? `/${pathStr}` : ""}`;
}
/**
 * ## 定义控制器Router
 * * 支持配置router的前缀
 * @description
 * @author Big Mogician
 * @param {string} prefix
 * @returns
 */
function RouterFactory(prefix) {
    return function router(target) {
        const router = tryGetRouter(target.prototype);
        router.prefix = prefix;
        Object.keys(router.routes).forEach(key => {
            const route = router.routes[key];
            if (route.path instanceof Array) {
                route.path = route.path.map(path => routeConnect(prefix, path, route.index));
            }
            else {
                route.path = routeConnect(prefix, route.path, route.index);
            }
        });
        return (target);
    };
}
exports.Router = RouterFactory;
function ServiceFactory(service) {
    return function router_service(target, propertyKey, descriptor) {
        if (propertyKey) {
            const prototype = target;
            const { routes } = tryGetRouter(prototype);
            const route = tryGetRoute(routes, propertyKey);
            route.service = service;
        }
        else {
            const { prototype } = target;
            const router = tryGetRouter(prototype);
            router.service = service;
            return target;
        }
    };
}
exports.Service = ServiceFactory;
function RouteFactory(...args) {
    return function route(target, propertyKey, descriptor) {
        const { routes } = tryGetRouter(target);
        const route = tryGetRoute(routes, propertyKey);
        route.method = args[0];
        route.path = args[1];
        route.index = !!args[2];
    };
}
function IndexFactory(...args) {
    return function indexRoute(target, propertyKey, descriptor) {
        RouteFactory("GET", args[0], true)(target, propertyKey, descriptor);
    };
}
exports.Index = IndexFactory;
function APIFactory(...args) {
    return function apiRoute(target, propertyKey, descriptor) {
        RouteFactory(args[0], args[1], false)(target, propertyKey, descriptor);
    };
}
exports.API = APIFactory;
/**
 * ## 路由元数据
 * * 目前支持为路由命名
 * @description
 * @author Big Mogician
 * @param {string} alias
 * @returns {RouteFactory}
 */
function MetadataFactory(alias) {
    return function routeMetadata(target, propertyKey, descriptor) {
        const { routes } = tryGetRouter(target);
        const route = tryGetRoute(routes, propertyKey);
        route.name = alias;
    };
}
exports.Metadata = MetadataFactory;
function AuthFactory(arr, metadata) {
    return function routeAuth(target, propertyKey, descriptor) {
        const { extend, errorMsg, error } = metadata || { extend: true, errorMsg: undefined, error: undefined };
        if (propertyKey) {
            const { routes } = tryGetRouter(target);
            const route = tryGetRoute(routes, propertyKey);
            route.auth = {
                rules: arr,
                extend: extend === undefined ? true : !!extend,
                errorMsg: errorMsg || "Auth failed.",
                error
            };
        }
        else {
            const router = tryGetRouter(target.prototype);
            router.auth = {
                rules: arr,
                errorMsg: errorMsg || "Auth failed.",
                error
            };
        }
    };
}
exports.Auth = AuthFactory;
exports.Authorize = AuthFactory;
function InjectFactory() {
    return function injectProperty(target, propertyKey, descriptor) {
        const router = tryGetRouter(target);
        const type = Reflect.getOwnMetadata("design:type", target, propertyKey);
        router.dependency.set(type, propertyKey);
    };
}
exports.Inject = InjectFactory;
//# sourceMappingURL=decorators.js.map