"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const utils_1 = require("./utils");
/**
 * ## 为Router注入服务
 * * 延迟初始化：注入的服务会在第一次访问时初始化
 * * 同路由中多次访问同一服务，服务保持单例状态
 * * ⚠️ 确保仅在Typescript环境使用此装饰器
 * * ⚠️ 确保开启`tsconfig.json`中的`emitDecoratorMetadata`选项
 * @description
 * @author Big Mogician
 * @template T
 * @returns {IRouteFactory}
 * @exports
 */
function InjectFactory() {
    return function injectProperty(target, propertyKey, descriptor) {
        const router = utils_1.tryGetRouter(target);
        const type = Reflect.getOwnMetadata("design:type", target, propertyKey);
        router.dependency.set(type, propertyKey);
    };
}
exports.InjectFactory = InjectFactory;
//# sourceMappingURL=inject.factory.js.map