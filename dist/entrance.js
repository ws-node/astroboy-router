"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function routeMethodImplements(prototype, method, route) {
    if (!prototype[method]) {
        const type = route.method;
        prototype[method] = async function () {
            let data = {};
            switch (type) {
                case "GET":
                    data = this.ctx.getRequestData();
                    break;
                default:
                    data = this.ctx.getPostData();
                    break;
            }
            this.ctx.json(0, "success", await this.business[method](data || {}));
        };
    }
}
function routerBusinessCreate(service, prototype) {
    if (service) {
        const oldInit = prototype.init || (() => { });
        prototype.init = async function () {
            await oldInit.bind(this)();
            this.business = new service(this.ctx);
        };
    }
}
function createRouter(ctor, name, root) {
    const prototype = ctor.prototype;
    const router = ctor.prototype["@router"];
    if (!router)
        throw new Error("Create router failed : invalid router controller");
    const service = router.service;
    routerBusinessCreate(service, prototype);
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
        routeMethodImplements(prototype, method, route);
        console.log(routeArr);
        return routeArr;
    });
}
exports.createRouter = createRouter;
//# sourceMappingURL=entrance.js.map