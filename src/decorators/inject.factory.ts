import "reflect-metadata";
import { IRouteFactory, RouterDefine } from "../metadata";
import { tryGetRouter } from "./utils";

/**
 * ## 为Router注入服务
 * * 延迟初始化：注入的服务会在第一次访问时初始化
 * * 同路由中多次访问同一服务，服务保持单例状态
 * * ⚠️ 确保仅在Typescript环境使用此装饰器
 * * ⚠️ 确保开启`tsconfig.json`中的`emitDecoratorMetadata`选项
 * @description
 * @author Big Mogician
 * @template T
 * @returns {IRouteFactory}
 * @exports
 */
export function InjectFactory<T = any>(): IRouteFactory {
  return function injectProperty(target: RouterDefine, propertyKey: string, descriptor?: PropertyDescriptor) {
    const router = tryGetRouter(target);
    const type = Reflect.getOwnMetadata("design:type", target, propertyKey);
    router.dependency.set(type, propertyKey);
  };
}