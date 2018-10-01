"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function AuthFactory(arr, metadata) {
    return function routeAuth(target, propertyKey, descriptor) {
        const { extend, errorMsg, error } = metadata || { extend: true, errorMsg: undefined, error: undefined };
        if (propertyKey) {
            const { routes } = utils_1.tryGetRouter(target);
            const route = utils_1.tryGetRoute(routes, propertyKey);
            route.auth = {
                rules: arr,
                extend: extend === undefined ? true : !!extend,
                errorMsg: errorMsg || "Auth failed.",
                error
            };
        }
        else {
            const router = utils_1.tryGetRouter(target.prototype);
            router.auth = {
                rules: arr,
                errorMsg: errorMsg || "Auth failed.",
                error
            };
        }
    };
}
exports.AuthFactory = AuthFactory;
function NoAuthFactory() {
    return function routeNoAuth(target, propertyKey) {
        AuthFactory([], { extend: false })(target, propertyKey);
    };
}
exports.NoAuthFactory = NoAuthFactory;
//# sourceMappingURL=auth.factory.js.map