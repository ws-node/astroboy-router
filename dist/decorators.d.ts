import { BaseClass } from "astroboy";
import { Constructor, ControllerConstructor, METHOD, RouteFactory } from "./metadata";
export declare function Router(prefix: string): <T extends Constructor<BaseClass>>(target: ControllerConstructor<InstanceType<T>>) => T & {
    [key: string]: any;
};
export declare function Service<T>(service: Constructor<T>): <T_1 extends Constructor<BaseClass>>(target: ControllerConstructor<InstanceType<T_1>>) => T_1 & {
    [key: string]: any;
};
export declare function Route(method: METHOD, path: string, inIndex?: boolean): RouteFactory;
export declare function Route(method: METHOD, path: string[], isIndex?: boolean): RouteFactory;
export declare function Index(path: string): RouteFactory;
export declare function Index(path: string[]): RouteFactory;
export declare function API(method: METHOD, path: string): RouteFactory;
export declare function Metadata(alias: string): RouteFactory;
