/// <reference types="astroboy"/>
import { BaseClass } from "astroboy";
import { RouterMetadata, Constructor, ControllerConstructor, METHOD, RouterDefine, Route, RouteFactory } from "./metadata";
import { RouterMap } from './core';

function tryGetRouter(target: RouterDefine) {
  const routerSaved = RouterMap.get(target);
  let router: RouterMetadata;
  router = <RouterMetadata>routerSaved;
  if (!routerSaved) {
    router = { prefix: "", routes: {} };
    RouterMap.set(target, router);
  }
  return router;
}

function routeConnect(prefix: string, pathStr: string, isIndex: boolean) {
  return `${!isIndex ? "api/" : ""}${prefix}${!!pathStr ? `/${pathStr}` : ""}`;
}

export function Router(prefix: string) {
  return function router<T extends Constructor<BaseClass>>(target: ControllerConstructor<InstanceType<T>>) {
    let router = <RouterMetadata>RouterMap.get(target.prototype);
    router = router || {
      prefix,
      routes: {}
    };
    router.prefix = prefix;
    Object.keys(router.routes).forEach(key => {
      const route = router.routes[key];
      if (route.path instanceof Array) {
        route.path = route.path.map(path => routeConnect(prefix, path, route.index));
      } else {
        route.path = routeConnect(prefix, route.path, route.index);
      }
    });
    RouterMap.set(target.prototype, router);
    target.prototype["@router"] = router;
    return <T & { [key: string]: any }>(target);
  };
}

export function Service<T>(service: Constructor<T>) {
  return function router_service<T extends Constructor<BaseClass>>(target: ControllerConstructor<InstanceType<T>>) {
    let router = <RouterMetadata>RouterMap.get(target.prototype);
    router = router || {
      prefix: "",
      routes: {}
    };
    router.service = service;
    RouterMap.set(target.prototype, router);
    target.prototype["@router"] = router;
    return <T & { [key: string]: any }>target;
  };
}

export function Route(method: METHOD, path: string, inIndex?: boolean): RouteFactory;
export function Route(method: METHOD, path: string[], isIndex?: boolean): RouteFactory;
export function Route(...args: any[]): RouteFactory {
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

export function Index(path: string): RouteFactory;
export function Index(path: string[]): RouteFactory;
export function Index(...args: any[]): RouteFactory {
  return function indexRoute(target: RouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    Route("GET", args[1], true)(target, propertyKey, descriptor);
  };
}

export function API(method: METHOD, path: string): RouteFactory;
export function API(...args: any[]): RouteFactory {
  return function apiRoute(target: RouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    Route(args[0], args[1], false)(target, propertyKey, descriptor);
  };
}

export function Metadata(alias: string): RouteFactory {
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