"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function ServiceFactory(service) {
    return function router_service(target, propertyKey, descriptor) {
        if (propertyKey) {
            const prototype = target;
            const { routes } = utils_1.tryGetRouter(prototype);
            const route = utils_1.tryGetRoute(routes, propertyKey);
            route.service = service;
        }
        else {
            const { prototype } = target;
            const router = utils_1.tryGetRouter(prototype);
            router.service = service;
            return target;
        }
    };
}
exports.ServiceFactory = ServiceFactory;
//# sourceMappingURL=service.factory.js.map