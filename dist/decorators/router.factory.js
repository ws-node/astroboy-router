"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const service_factory_1 = require("./service.factory");
const auth_factory_1 = require("./auth.factory");
function RouterFactory(...args) {
    const meta = args[0];
    const hasMetadata = typeof meta !== "string";
    const prefix = hasMetadata ? meta.prefix : meta;
    const apiPrefix = (hasMetadata ? meta.apiPrefix : undefined) || "api";
    return function router(target) {
        const router = utils_1.tryGetRouter(target.prototype);
        router.prefix = prefix;
        router.apiPrefix = apiPrefix;
        Object.keys(router.routes).forEach(key => {
            const route = router.routes[key];
            if (route.path instanceof Array) {
                route.path = route.path.map(path => utils_1.routeConnect(prefix, apiPrefix, path, route.index));
            }
            else {
                route.path = utils_1.routeConnect(prefix, apiPrefix, route.path, route.index);
            }
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