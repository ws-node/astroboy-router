"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_init_1 = require("./service-init");
const route_implements_1 = require("./route-implements");
const utils_1 = require("./utils");
function createRouter(...args) {
    let ctor;
    let name;
    let root;
    let debug = false;
    if (args.length === 1) {
        [ctor, name, root] = [args[0].router, args[0].name, args[0].root];
        if (args[0].debug !== undefined)
            debug = !!args[0].debug;
    }
    else {
        [ctor, name, root] = args;
    }
    const prototype = ctor.prototype;
    const router = ctor.prototype["@router"];
    // 未经装饰，不符合Router的要求，终止应用程序
    if (!router)
        throw new Error(`Create router failed : invalid router controller [${ctor && ctor.name}]`);
    const service = router.service;
    service_init_1.routerBusinessCreate(service, prototype, router.dependency);
    const result = [];
    Object.keys(router.routes).forEach(methodName => {
        const route = router.routes[methodName];
        const allRouteMethods = [];
        route.method.forEach(method => {
            const routeArr = [];
            if (!!route.name)
                routeArr.push(route.name);
            routeArr.push(method);
            if (route.path instanceof Array) {
                routeArr.push(route.path.map(path => `${root}/${path}`));
            }
            else {
                routeArr.push(`${root}/${route.path}`);
            }
            routeArr.push(name);
            routeArr.push(methodName);
            const { extend, rules, errorMsg, error } = route.auth;
            route_implements_1.routeMethodImplements({
                prototype,
                method,
                methodName,
                route,
                auth: {
                    rules: extend ? [...router.auth.rules, ...rules] : rules,
                    errorMsg: extend ? errorMsg : router.auth.errorMsg,
                    error: extend ? error : router.auth.error
                },
                serviceCtor: route.service || service || undefined,
                scopeService: route.service !== undefined,
                resolve: utils_1.resolveDefaultBodyParser()
            });
            allRouteMethods.push(routeArr);
        });
        result.push(...allRouteMethods);
    });
    if (debug) {
        // tslint:disable-next-line:no-console
        console.log(`======${name}======`);
        // tslint:disable-next-line:no-console
        console.log(result);
    }
    return result;
}
exports.createRouter = createRouter;
//# sourceMappingURL=index.js.map