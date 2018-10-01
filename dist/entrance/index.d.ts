import { ControllerConstructor } from "../metadata";
interface RouterOptions {
    router: ControllerConstructor;
    name: string;
    root: string;
    debug?: boolean;
}
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
export declare function createRouter(options: RouterOptions): (string | string[])[][];
export {};
