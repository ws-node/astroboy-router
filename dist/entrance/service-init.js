"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
/**
 * ## 初始化业务服务
 * * 包裹controller的init函数
 * * 原始init方法完成后初始化business
 * @description
 * @author Big Mogician
 * @param {(Constructor<any> | undefined)} service
 * @param {any} prototype
 * @param {Map<Constructor<any>, string>} depedency
 * @returns
 * @exports
 */
function routerBusinessCreate(service, prototype, depedency) {
    const funcName = prototype.constructor.name;
    Array.from(depedency.entries()).forEach(([service, key]) => {
        if (key === "business")
            throw new Error(`Inject service failed: you can not define business service manually on router [${funcName}].`);
        const metaKey = utils_1.routeMeta(key);
        try {
            Object.defineProperty(prototype, key, {
                get: function () { return this[metaKey] || (this[metaKey] = new service(this.ctx)); },
                configurable: false,
                enumerable: false
            });
        }
        catch (error) {
            throw new Error(`Inject service failed: duplicate service property [${key}] name on router [${funcName}]`);
        }
    });
    if (service) {
        const oldInit = prototype.init || (() => { });
        prototype.init = async function () {
            await oldInit.bind(this)();
            this.business = new service(this.ctx);
        };
    }
}
exports.routerBusinessCreate = routerBusinessCreate;
//# sourceMappingURL=service-init.js.map