import { IRouterFactory, IRouterMetaConfig, IController, IPipeResolveContext } from "../metadata";
import { tryGetRouter, readPath, readPipes, createArgsSolution } from "./utils";

const noop = () => {};

/**
 * ## 定义控制器Router
 * * 支持配置router的前缀
 * @description
 * @author Big Mogician
 * @param {string} prefix
 * @returns {IRouterFactory}
 * @exports
 */
export function RouterFactory(prefix: string): IRouterFactory;
/**
 * ## 定义控制器Router
 * * 配置router的前缀
 * @description
 * @author Big Mogician
 * @template S
 * @param {IRouterMetaConfig} metadata
 * @returns {IRouterFactory}
 * @exports
 */
export function RouterFactory<S>(metadata: IRouterMetaConfig): IRouterFactory;
export function RouterFactory(meta: string | IRouterMetaConfig) {
  let options: IRouterMetaConfig = <any>meta;
  if (typeof meta === "string") options = { group: meta };
  const { rules = [], handler = undefined } = options.pipes || {};
  return function router<T extends typeof IController>(target: T) {
    const router = tryGetRouter(target.prototype);
    router.group = options.group || router.group;
    router.pipes = {
      rules: [...router.pipes.rules, ...(rules || [])],
      handler: handler || router.pipes.handler
    };
    router.extensions = {
      ...router.extensions,
      ...options.extensions
    };
    Object.keys(router.routes).forEach(key => {
      const route = router.routes[key];
      if (route.resolved) return;
      readPath(router.group, route);
      readPipes(router, route);
      createArgsSolution(route);
      route.resolved = true;
    });
    if (options.register) {
      options.register({
        lifecycle(name, resolver, reset = false) {
          let lifes = router.lifeCycle[name];
          if (!lifes) lifes = router.lifeCycle[name] = [];
          return !reset ? (<any[]>lifes).push(resolver) : (router.lifeCycle[name] = [<any>resolver]);
        },
        create(resolver, reset = false) {
          if (!router.onCreate) router.onCreate = [];
          return !reset ? router.onCreate.push(resolver) : (router.onCreate = [resolver]);
        }
      });
    }
    return <T>target;
  };
}
