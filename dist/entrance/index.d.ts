import { ControllerConstructor } from "../metadata";
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
export declare function createRouter(ctor: ControllerConstructor, name: string, root: string): (string | string[])[][];
