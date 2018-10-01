import { Constructor } from "../metadata";
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
export declare function routerBusinessCreate(service: Constructor<any> | undefined, prototype: any, depedency: Map<Constructor<any>, string>): void;
