import { BaseClass } from "astroboy";
import { Constructor, ControllerConstructor, METHOD, RouteFactory } from "./metadata";
declare abstract class IController extends BaseClass {
    [key: string]: any;
}
declare function RouterFactory(prefix: string): <T extends Constructor<IController>>(target: ControllerConstructor<InstanceType<T>>) => T;
declare function ServiceFactory<T>(service: Constructor<T>): <T_1 extends Constructor<IController>>(target: ControllerConstructor<InstanceType<T_1>>) => T_1;
declare function RouteFactory(method: METHOD, path: string, inIndex?: boolean): RouteFactory;
declare function RouteFactory(method: METHOD, path: string[], isIndex?: boolean): RouteFactory;
declare function IndexFactory(path: string): RouteFactory;
declare function IndexFactory(path: string[]): RouteFactory;
declare function APIFactory(method: METHOD, path: string): RouteFactory;
declare function MetadataFactory(alias: string): RouteFactory;
export { RouterFactory as Router, RouteFactory as Route, ServiceFactory as Service, IndexFactory as Index, APIFactory as API, MetadataFactory as Metadata };
