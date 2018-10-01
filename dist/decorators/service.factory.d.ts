import { Constructor, IMixinFactory } from "../metadata";
/**
 * ## 为当前Router/Route绑定业务逻辑服务
 * * 业务逻辑服务名限定为`business`
 * * 服务在router初始化(`init`)后自动创建
 * @description
 * @author Big Mogician
 * @template S
 * @param {Constructor<S>} service
 * @returns {IMixinFactory}
 * @exports
 */
export declare function ServiceFactory<S>(service: Constructor<S>): IMixinFactory;
