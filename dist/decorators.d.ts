import { BaseClass } from "astroboy";
import { Constructor, ControllerConstructor, METHOD, RouteFactory } from "./metadata";
declare function RouterFactory(prefix: string): <T extends Constructor<BaseClass>>(target: ControllerConstructor<InstanceType<T>>) => T & {
    [key: string]: any;
};
declare function ServiceFactory<T>(service: Constructor<T>): <T_1 extends Constructor<BaseClass>>(target: ControllerConstructor<InstanceType<T_1>>) => T_1 & {
    [key: string]: any;
};
declare function RouteFactory(method: METHOD, path: string, inIndex?: boolean): RouteFactory;
declare function RouteFactory(method: METHOD, path: string[], isIndex?: boolean): RouteFactory;
declare function IndexFactory(path: string): RouteFactory;
declare function IndexFactory(path: string[]): RouteFactory;
declare function APIFactory(method: METHOD, path: string): RouteFactory;
declare function MetadataFactory(alias: string): RouteFactory;
export { RouterFactory as Router, RouteFactory as Route, ServiceFactory as Service, IndexFactory as Index, APIFactory as API, MetadataFactory as Metadata };
