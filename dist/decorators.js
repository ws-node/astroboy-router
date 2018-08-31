"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("./metadata");
const core_1 = require("./core");
function tryGetRouter(target) {
    const routerSaved = core_1.RouterMap.get(target);
    let router;
    router = routerSaved;
    if (!routerSaved) {
        router = { prefix: "", routes: {} };
        core_1.RouterMap.set(target, router);
    }
    return router;
}
function routeConnect(prefix, pathStr, isIndex) {
    return `${!isIndex ? "api/" : ""}${prefix}${!!pathStr ? `/${pathStr}` : ""}`;
}
function Router(prefix) {
    return function router(target) {
        let router = core_1.RouterMap.get(target.prototype);
        router = router || {
            prefix,
            routes: {}
        };
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
        core_1.RouterMap.set(target.prototype, router);
        target.prototype["@router"] = router;
        return (target);
    };
}
exports.Router = Router;
function Service(service) {
    return function router_service(target) {
        let router = core_1.RouterMap.get(target.prototype);
        router = router || {
            prefix: "",
            routes: {}
        };
        router.service = service;
        core_1.RouterMap.set(target.prototype, router);
        target.prototype["@router"] = router;
        return target;
    };
}
exports.Service = Service;
function Route(...args) {
    return function route(target, propertyKey, descriptor) {
        const { prefix, routes } = tryGetRouter(target);
        const route = routes[propertyKey];
        if (route) {
            route.method = args[0];
            route.path = args[1];
            route.index = !!args[2];
        }
        else {
            routes[propertyKey] = {
                name: undefined,
                method: args[0],
                path: args[1],
                index: !!args[2]
            };
        }
    };
}
exports.Route = Route;
function Index(...args) {
    return function indexRoute(target, propertyKey, descriptor) {
        metadata_1.Route("GET", args[1], true)(target, propertyKey, descriptor);
    };
}
exports.Index = Index;
function API(...args) {
    return function apiRoute(target, propertyKey, descriptor) {
        metadata_1.Route(args[0], args[1], false)(target, propertyKey, descriptor);
    };
}
exports.API = API;
function Metadata(alias) {
    return function routeMetadata(target, propertyKey, descriptor) {
        const { prefix, routes } = tryGetRouter(target);
        const route = routes[propertyKey];
        if (route) {
            route.name = alias;
        }
        else {
            routes[propertyKey] = {
                name: alias,
                method: "GET",
                path: "",
                index: false
            };
        }
    };
}
exports.Metadata = Metadata;
//# sourceMappingURL=decorators.js.map