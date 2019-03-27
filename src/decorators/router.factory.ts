import { IRouterFactory, IRouterMetaConfig, IController, IRouterLifeCycle, IPipeResolveContext } from "../metadata";
import { tryGetRouter, readPath, readPipes } from "./utils";

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
export function RouterFactory(...args: any[]) {
  const meta = args[0];
  const hasMetadata = typeof meta !== "string";
  const group = hasMetadata ? (<IRouterMetaConfig>meta).group : <string>meta;
  const register = hasMetadata ? (<IRouterMetaConfig>meta).register : noop;
  const pipes: Partial<IPipeResolveContext> = hasMetadata ? (<IRouterMetaConfig>meta).pipes || {} : {};
  const extensions = hasMetadata ? (<IRouterMetaConfig>meta).extensions || {} : {};
  return function router<T extends typeof IController>(target: T) {
    const router = tryGetRouter(target.prototype);
    router.group = group;
    router.pipes = {
      rules: pipes.rules || [],
      handler: pipes.handler
    };
    router.extensions = {
      ...router.extensions,
      ...extensions
    };
    Object.keys(router.routes).forEach(key => {
      const route = router.routes[key];
      readPath(group, route);
      readPipes(router, route);
    });
    if (register) {
      register({
        lifecycle(name, resolver, reset = false) {
          let lifes = router.lifeCycle[name];
          if (!lifes) lifes = router.lifeCycle[name] = [];
          return !reset ? (<any[]>lifes).push(resolver) : (lifes = [<any>resolver]);
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
