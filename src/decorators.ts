import { Router, Constructor, METHOD, RouterDefine, Route, RouteFactory, IController } from "./metadata";
import { RouterMap } from './core';

function tryGetRouter(target: RouterDefine | IController) {
  const routerSaved = RouterMap.get(target);
  let router: Router;
  router = <Router>routerSaved;
  if (!routerSaved) {
    router = { prefix: "", routes: {} };
    RouterMap.set(target, router);
  }
  return router;
}

function routeConnect(prefix: string, pathStr: string, isIndex: boolean) {
  return `${!isIndex ? "api/" : ""}${prefix}${!!pathStr ? `/${pathStr}` : ""}`;
}

function RouterFactory(prefix: string) {
  return function router<T extends typeof IController>(target: T) {
    const router = tryGetRouter(target.prototype);
    router.prefix = prefix;
    Object.keys(router.routes).forEach(key => {
      const route = router.routes[key];
      if (route.path instanceof Array) {
        route.path = route.path.map(path => routeConnect(prefix, path, route.index));
      } else {
        route.path = routeConnect(prefix, route.path, route.index);
      }
    });
    target.prototype["@router"] = router;
    return <T>(target);
  };
}

function ServiceFactory<S>(service: Constructor<S>) {
  return function router_service<T extends typeof IController>(target: T) {
    const router = tryGetRouter(target.prototype);
    router.service = service;
    target.prototype["@router"] = router;
    return <T>target;
  };
}

function RouteFactory(method: METHOD, path: string, inIndex?: boolean): RouteFactory;
function RouteFactory(method: METHOD, path: string[], isIndex?: boolean): RouteFactory;
function RouteFactory(...args: any[]): RouteFactory {
  return function route(target: RouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    const { prefix, routes } = tryGetRouter(target);
    const route = routes[propertyKey];
    if (route) {
      route.method = args[0];
      route.path = args[1];
      route.index = !!args[2];
    } else {
      routes[propertyKey] = {
        name: undefined,
        method: args[0],
        path: args[1],
        index: !!args[2]
      };
    }
  };
}

function IndexFactory(path: string): RouteFactory;
function IndexFactory(path: string[]): RouteFactory;
function IndexFactory(...args: any[]): RouteFactory {
  return function indexRoute(target: RouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    RouteFactory("GET", args[0], true)(target, propertyKey, descriptor);
  };
}

function APIFactory(method: METHOD, path: string): RouteFactory;
function APIFactory(...args: any[]): RouteFactory {
  return function apiRoute(target: RouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    RouteFactory(args[0], args[1], false)(target, propertyKey, descriptor);
  };
}

function MetadataFactory(alias: string): RouteFactory {
  return function routeMetadata(target: RouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    const { prefix, routes } = tryGetRouter(target);
    const route = routes[propertyKey];
    if (route) {
      route.name = alias;
    } else {
      routes[propertyKey] = {
        name: alias,
        method: "GET",
        path: "",
        index: false
      };
    }
  };
}

export {
  RouterFactory as Router,
  RouteFactory as Route,
  ServiceFactory as Service,
  IndexFactory as Index,
  APIFactory as API,
  MetadataFactory as Metadata
};
