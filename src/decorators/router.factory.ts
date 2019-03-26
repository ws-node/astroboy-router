import { IRouterFactory, IRouterMetaConfig, IController, IRouterLifeCycle } from "../metadata";
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
  return function router<T extends typeof IController>(target: T) {
    const router = tryGetRouter(target.prototype);
    router.group = group;
    Object.keys(router.routes).forEach(key => {
      const route = router.routes[key];
      readPath(route);
      readPipes(router, route);
    });
    if (register) {
      register({
        lifecycle(name, resolver, reset = false) {
          let lifes = router.lifeCycle[name];
          if (!lifes) lifes = router.lifeCycle[name] = [];
          return !reset ? (<any[]>lifes).push(resolver) : (lifes = [resolver]);
        },
        onbuild(resolver, reset = false) {
          if (!router.onBuild) router.onBuild = [];
          return !reset ? router.onBuild.push(resolver) : (router.onBuild = [resolver]);
        }
      });
    }
    return <T>target;
  };
}
