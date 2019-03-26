import { Constructor, IRouter, IRoute, IRouterBuildContext } from "../metadata";
import { routeMeta } from "./utils";

export async function buildRouterInstance(prototype: any, methodName: string, router: IRouter, route: IRoute) {
  const { lifeCycle } = router;
  const onCreate = lifeCycle.onCreate || [];
  if (onCreate.length === 0) onCreate.push(defaultOnCreate);
  try {
    for (const each of onCreate) {
      await each({ router, route }, prototype);
    }
  } catch (error) {
    // tslint:disable-next-line: no-console
    console.error(error);
    throw new Error("Create router class failed");
  }
}

function defaultOnCreate({ router }: IRouterBuildContext, prototype: any) {
  // DO NOTHING
}

/**
 * ## 初始化业务服务
 * * 包裹controller的init函数
 * * 原始init方法完成后初始化business
 * @description
 * @author Big Mogician
 * @param {(Constructor<any> | undefined)} service
 * @param {any} prototype
 * @param {Map<Constructor<any>, string>} depedency
 * @returns
 * @exports
 */
export function routerBusinessCreate(service: Constructor<any> | undefined, prototype: any, depedency: Map<Constructor<any>, string>): void {
  const funcName = prototype.constructor.name;
  Array.from(depedency.entries()).forEach(([service, key]) => {
    if (key === "business") throw new Error(`Inject service failed: you can not define business service manually on router [${funcName}].`);
    const metaKey = routeMeta(key);
    try {
      Object.defineProperty(prototype, key, {
        get() {
          return this[metaKey] || (this[metaKey] = new service(this.ctx));
        },
        configurable: false,
        enumerable: false
      });
    } catch (error) {
      throw new Error(`Inject service failed: duplicate service property [${key}] name on router [${funcName}]`);
    }
  });
  if (service) {
    const oldInit = prototype.init || (() => {});
    prototype.init = async function() {
      await oldInit.bind(this)();
      this.business = new service(this.ctx);
    };
  }
}
