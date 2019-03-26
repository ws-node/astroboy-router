// import { Constructor, IMixinFactory, IRouterDefine, IController } from "../metadata";
// import { tryGetRouter, tryGetRoute } from "./utils";

// /**
//  * ## 为当前Router/Route绑定业务逻辑服务
//  * * 业务逻辑服务名限定为`business`
//  * * 服务在router初始化(`init`)后自动创建
//  * @description
//  * @author Big Mogician
//  * @template S
//  * @param {Constructor<S>} service
//  * @returns {IMixinFactory}
//  * @exports
//  */
// export function ServiceFactory<S>(service: Constructor<S>): IMixinFactory;
// export function ServiceFactory<S>(service: Constructor<S>) {
//   return function router_service<T extends IRouterDefine | typeof IController>(target: T, propertyKey?: string, descriptor?: PropertyDescriptor) {
//     if (propertyKey) {
//       const prototype = <IRouterDefine>target;
//       const { routes } = tryGetRouter(prototype);
//       const route = tryGetRoute(routes, propertyKey);
//       route.service = service;
//     } else {
//       const { prototype } = <typeof IController>target;
//       const router = tryGetRouter(prototype);
//       router.service = service;
//       return <T>target;
//     }
//   };
// }
