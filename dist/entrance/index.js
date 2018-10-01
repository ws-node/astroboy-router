"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_init_1 = require("./service-init");
const route_implements_1 = require("./route-implements");
const utils_1 = require("./utils");
/**
 * ## 生成astroboy路由配置
 * @description
 * @author Big Mogician
 * @export
 * @param {ControllerConstructor} ctor
 * @param {string} name
 * @param {string} root
 * @returns
 * @exports
 */
function createRouter(ctor, name, root) {
    const prototype = ctor.prototype;
    const router = ctor.prototype["@router"];
    // 未经装饰，不符合Router的要求，终止应用程序
    if (!router)
        throw new Error(`Create router failed : invalid router controller [${ctor && ctor.name}]`);
    const service = router.service;
    service_init_1.routerBusinessCreate(service, prototype, router.dependency);
    return Object.keys(router.routes).map(method => {
        const route = router.routes[method];
        const routeArr = [];
        if (!!route.name)
            routeArr.push(route.name);
        routeArr.push(route.method);
        if (route.path instanceof Array) {
            routeArr.push(route.path.map(path => `${root}/${path}`));
        }
        else {
            routeArr.push(`${root}/${route.path}`);
        }
        routeArr.push(name);
        routeArr.push(method);
        const { extend, rules, errorMsg, error } = route.auth;
        route_implements_1.routeMethodImplements({
            prototype,
            method,
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
        return routeArr;
    });
}
exports.createRouter = createRouter;
//# sourceMappingURL=index.js.map