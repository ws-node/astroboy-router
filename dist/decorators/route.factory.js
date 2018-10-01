"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function RouteFactory(...args) {
    return function route(target, propertyKey, descriptor) {
        const { routes } = utils_1.tryGetRouter(target);
        const route = utils_1.tryGetRoute(routes, propertyKey);
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
exports.IndexFactory = IndexFactory;
function APIFactory(...args) {
    return function apiRoute(target, propertyKey, descriptor) {
        RouteFactory(args[0], args[1], false)(target, propertyKey, descriptor);
    };
}
exports.APIFactory = APIFactory;
/**
 * ## 路由元数据
 * * 目前支持为路由命名
 * @description
 * @author Big Mogician
 * @param {string} alias
 * @returns {RouteFactory}
 * @exports
 */
function MetadataFactory(alias) {
    return function routeMetadata(target, propertyKey, descriptor) {
        const { routes } = utils_1.tryGetRouter(target);
        const route = utils_1.tryGetRoute(routes, propertyKey);
        route.name = alias;
    };
}
exports.MetadataFactory = MetadataFactory;
//# sourceMappingURL=route.factory.js.map