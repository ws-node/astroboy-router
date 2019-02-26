"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
/**
 * ## 定义路由方法
 * * 支持多路径
 * * 支持定义METHOD
 * * 区分Index和API
 * * Route不公开，做后续扩展支持
 * @description
 * @author Big Mogician
 * @param {RouteBaseConfig} options
 * @returns {IRouteFactory}
 */
function RouteFactory(options) {
    return function route(target, propertyKey, descriptor) {
        const { routes } = utils_1.tryGetRouter(target);
        const route = utils_1.tryGetRoute(routes, propertyKey);
        const { method, path, isIndex, tpl } = options;
        // 封锁多method的能力，暂时没有用单一路由处理多method的需求，
        // 根据情况未来可能考虑做开放
        route.method = [method];
        route.pathConfig.push(...path);
        route.index = !!isIndex;
        route.urlTpl = tpl;
    };
}
function IndexFactory(...args) {
    const options = args[1] || {};
    return function indexRoute(target, propertyKey, descriptor) {
        if (options.name)
            MetadataFactory(options.name)(target, propertyKey, descriptor);
        const paths = args[0] instanceof Array ? args[0] : [args[0]];
        RouteFactory({
            method: "GET",
            path: paths.map(path => ({ path, sections: options.sections || {} })),
            isIndex: true,
            tpl: options.tpl
        })(target, propertyKey, descriptor);
    };
}
exports.IndexFactory = IndexFactory;
function APIFactory(...args) {
    const options = args[2] || {};
    return function apiRoute(target, propertyKey, descriptor) {
        if (options.name)
            MetadataFactory(options.name)(target, propertyKey, descriptor);
        RouteFactory({
            method: args[0],
            path: [{ path: args[1], sections: options.sections || {} }],
            isIndex: false,
            tpl: options.tpl
        })(target, propertyKey, descriptor);
    };
}
exports.APIFactory = APIFactory;
/**
 * ## 自定义的路由
 * @description
 * @author Big Mogician
 * @export
 * @param {CustonRouteOptions} options
 * @returns {IRouteFactory}
 * @exports
 */
function CustomRouteFactory(options) {
    const method = options.method;
    const isIndex = !!options.isIndex;
    return function customApiRoute(target, propertyKey, descriptor) {
        if (options.name)
            MetadataFactory(options.name)(target, propertyKey, descriptor);
        options.tpls.forEach(item => {
            const [tpl, sections] = typeof item === "string" ? [item, {}] : [item.tpl, item.sections || {}];
            RouteFactory({
                method,
                path: [{ path: "", sections, urlTpl: tpl }],
                isIndex,
                tpl
            })(target, propertyKey, descriptor);
        });
    };
}
exports.CustomRouteFactory = CustomRouteFactory;
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
function MetadataFactory(alias) {
    return function routeMetadata(target, propertyKey, descriptor) {
        const { routes } = utils_1.tryGetRouter(target);
        const route = utils_1.tryGetRoute(routes, propertyKey);
        route.name = alias;
    };
}
exports.MetadataFactory = MetadataFactory;
//# sourceMappingURL=route.factory.js.map