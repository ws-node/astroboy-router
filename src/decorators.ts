import "reflect-metadata";
import { Router, Constructor, METHOD, RouterDefine, Route, RouteFactory, IController, RouterFactory, AuthGuard, RouterAuthMetadata, RouteAuthMetadata, MixinFactory } from "./metadata";
import { RouterMap } from './core';

/**
 * ## 获取router配置参数
 * * 如果是第一次配置，先做存储
 * @description
 * @author Big Mogician
 * @param {(RouterDefine | IController)} target 控制器原型
 * @returns 
 */
function tryGetRouter(target: RouterDefine | IController) {
  const routerSaved = RouterMap.get(target);
  let router: Router;
  router = <Router>routerSaved;
  if (!routerSaved) {
    router = {
      prefix: "",
      routes: {},
      dependency: new Map(),
      auth: {
        rules: [],
        errorMsg: "Auth failed."
      }
    };
    RouterMap.set(target, router);
  }
  target["@router"] = router;
  return router;
}

/**
 * ## 获取route配置参数
 * * 如果是第一次配置当前路由项，先做初始化
 * @description
 * @author Big Mogician
 * @param {{ [key: string]: Route }} routes
 * @param {string} key
 * @returns 
 */
function tryGetRoute(routes: { [key: string]: Route }, key: string) {
  let route = routes[key];
  if (!route) {
    route = routes[key] = {
      name: undefined,
      method: "GET",
      path: "",
      index: false,
      auth: {
        rules: [],
        extend: true,
        errorMsg: "Auth failed."
      }
    };
  }
  return route;
}


/**
 * ## 连接路由
 * * 连接router前缀和path
 * * API路由在前缀和路由根之间插入`api`层级
 * @description
 * @author Big Mogician
 * @param {string} prefix
 * @param {string} pathStr
 * @param {boolean} isIndex
 * @returns 
 */
function routeConnect(prefix: string, pathStr: string, isIndex: boolean) {
  return `${!isIndex ? "api/" : ""}${prefix}${!!pathStr ? `/${pathStr}` : ""}`;
}

/**
 * ## 定义控制器Router
 * * 支持配置router的前缀
 * @description
 * @author Big Mogician
 * @param {string} prefix
 * @returns 
 */
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
    return <T>(target);
  };
}

/**
 * ## 为当前Router/Route绑定业务逻辑服务
 * * 业务逻辑服务名限定为`business`
 * * 服务在router初始化(`init`)后自动创建
 * @description
 * @author Big Mogician
 * @template S
 * @param {Constructor<S>} service
 * @returns 
 */
function ServiceFactory<S>(service: Constructor<S>): MixinFactory;
function ServiceFactory<S>(service: Constructor<S>) {
  return function router_service<T extends (RouterDefine | typeof IController)>(target: T, propertyKey?: string, descriptor?: PropertyDescriptor) {
    if (propertyKey) {
      const prototype = <RouterDefine>target;
      const { routes } = tryGetRouter(prototype);
      const route = tryGetRoute(routes, propertyKey);
      route.service = service;
    } else {
      const { prototype } = <typeof IController>target
      const router = tryGetRouter(prototype);
      router.service = service;
      return <T>target;
    }
  };
}

/**
 * ## 定义路由方法
 * * 支持多路径
 * * 支持定义METHOD
 * * 区分Index和API
 * * Route不公开，做后续扩展支持
 * @description
 * @author Big Mogician
 * @param {METHOD} method
 * @param {string} path
 * @param {boolean} [inIndex]
 * @returns {RouteFactory}
 */
function RouteFactory(method: METHOD, path: string, inIndex?: boolean): RouteFactory;
function RouteFactory(method: METHOD, path: string[], isIndex?: boolean): RouteFactory;
function RouteFactory(...args: any[]): RouteFactory {
  return function route(target: RouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    const { routes } = tryGetRouter(target);
    const route = tryGetRoute(routes, propertyKey);
    route.method = args[0];
    route.path = args[1];
    route.index = !!args[2];
  };
}

/**
 * ## 定义Index页面
 * @description
 * @author Big Mogician
 * @param {string} path
 * @returns {RouteFactory}
 */
function IndexFactory(path: string): RouteFactory;
/**
 * ## 定义Index页面（多路由支持）
 * @description
 * @author Big Mogician
 * @param {string[]} path
 * @returns {RouteFactory}
 */
function IndexFactory(path: string[]): RouteFactory;
function IndexFactory(...args: any[]): RouteFactory {
  return function indexRoute(target: RouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    RouteFactory("GET", args[0], true)(target, propertyKey, descriptor);
  };
}

/**
 * ## 定义api
 * * api不支持多路由映射
 * @description
 * @author Big Mogician
 * @param {METHOD} method
 * @param {string} path
 * @returns {RouteFactory}
 */
function APIFactory(method: METHOD, path: string): RouteFactory;
function APIFactory(...args: any[]): RouteFactory {
  return function apiRoute(target: RouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    RouteFactory(args[0], args[1], false)(target, propertyKey, descriptor);
  };
}

/**
 * ## 路由元数据
 * * 目前支持为路由命名
 * @description
 * @author Big Mogician
 * @param {string} alias
 * @returns {RouteFactory}
 */
function MetadataFactory(alias: string): RouteFactory {
  return function routeMetadata(target: RouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    const { routes } = tryGetRouter(target);
    const route = tryGetRoute(routes, propertyKey);
    route.name = alias;
  };
}

function AuthFactory(arr: AuthGuard[], metadata: RouteAuthMetadata): MixinFactory;
function AuthFactory(arr: AuthGuard[]): MixinFactory;
function AuthFactory(arr: AuthGuard[], metadata?: RouteAuthMetadata) {
  return function routeAuth(target: RouterDefine | typeof IController, propertyKey?: string, descriptor?: PropertyDescriptor) {
    const { extend, errorMsg, error } = metadata || { extend: true, errorMsg: undefined, error: undefined };
    if (propertyKey) {
      const { routes } = tryGetRouter(<RouterDefine>target);
      const route = tryGetRoute(routes, propertyKey);
      route.auth = {
        rules: arr,
        extend: extend === undefined ? true : !!extend,
        errorMsg: errorMsg || "Auth failed.",
        error
      };
    } else {
      const router = tryGetRouter((<typeof IController>target).prototype);
      router.auth = {
        rules: arr,
        errorMsg: errorMsg || "Auth failed.",
        error
      };
    }
  };
}

function InjectFactory<T = any>(): RouteFactory {
  return function injectProperty(target: RouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    const router = tryGetRouter(target);
    const type = Reflect.getOwnMetadata("design:type", target, propertyKey);
    router.dependency.set(type, propertyKey);
  };
}

export {
  RouterFactory as Router,
  // RouteFactory as Route, // 不公开
  ServiceFactory as Service,
  IndexFactory as Index,
  APIFactory as API,
  MetadataFactory as Metadata,
  AuthFactory as Auth,
  AuthFactory as Authorize,
  InjectFactory as Inject
};
