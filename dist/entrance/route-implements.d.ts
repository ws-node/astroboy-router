import { AuthGuard, Route, Constructor, BodyResolve } from "../metadata";
/**
 * ## 实现未实现的路由方法
 * * 使用astroboy的推荐写法完成默认路由实现
 * @description
 * @author Big Mogician
 * @param {({
 *   prototype: any,
 *   method: string,
 *   route: Route,
 *   auth: { rules: AuthGuard[], errorMsg: string, error?: any },
 *   serviceCtor: Constructor<any> | undefined,
 *   scopeService: boolean,
 *   resolve: BodyResolve
 * })} metadata
 * @returns
 * @exports
 */
export declare function routeMethodImplements(metadata: {
    prototype: any;
    method: string;
    route: Route;
    auth: {
        rules: AuthGuard[];
        errorMsg: string;
        error?: any;
    };
    serviceCtor: Constructor<any> | undefined;
    scopeService: boolean;
    resolve: BodyResolve;
}): void;
