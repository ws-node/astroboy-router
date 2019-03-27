import { IRoute, IRouter, IRouteBuildContext, IPipeResolveContext, IRouterLifeCycle } from "../metadata";

export function buildRouteMethod(prototype: any, methodName: string, router: IRouter, route: IRoute) {
  const { lifeCycle = {} } = router;
  const onBuild = lifeCycle.onBuild || [];
  try {
    for (const eachBuild of onBuild) {
      eachBuild({ router, route, name: methodName }, prototype);
    }
  } catch (error) {
    // tslint:disable-next-line: no-console
    console.error(error);
    throw new Error("Create route method failed");
  }
}

export function defaultOnBuild({ router, name = "" }: IRouteBuildContext, prototype: any) {
  const { lifeCycle, pipes } = router;
  const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
  if (!descriptor) throw new Error("Create route method failed: init an abstract route method without a service is not allowed.");
  const needPipe = pipes.rules.length > 0;
  const needOnPipe = (lifeCycle.onPipes || []).length > 0;
  const needOnEnter = (lifeCycle.onEnter || []).length > 0;
  const needOnQuit = (lifeCycle.onQuit || []).length > 0;
  const sourceRouteMethod: (...args: any[]) => Promise<any> = descriptor.value!;
  const hooks = createLifeHooks(lifeCycle);
  descriptor!.value = async function(...args: any[]) {
    if (needOnPipe) await hooks.runOnPipes.call(this);
    if (needPipe) await hooks.runPipes.call(this, pipes);
    if (needOnEnter) await hooks.runOnEnters.call(this);
    await sourceRouteMethod.call(this, ...args);
    if (needOnQuit) await hooks.runOnQuits.call(this);
  };
  Object.defineProperty(prototype, name, descriptor!);
}

export function createLifeHooks(lifeCycle: Partial<IRouterLifeCycle>) {
  return {
    async runOnPipes(this: any) {
      for (const eachOnPipe of lifeCycle.onPipes || []) {
        await eachOnPipe(this);
      }
    },
    async runOnEnters(this: any) {
      for (const eachOnEnter of lifeCycle.onEnter || []) {
        await eachOnEnter(this);
      }
    },
    async runOnQuits(this: any) {
      for (const eachOnQuit of lifeCycle.onQuit || []) {
        await eachOnQuit(this);
      }
    },
    async runPipes(this: any, pipes: IPipeResolveContext<void>) {
      try {
        for (const eachPipe of pipes.rules || []) {
          await eachPipe(this);
        }
      } catch (error) {
        if (!pipes.handler) {
          throw error;
        }
        pipes.handler(error, error.msg);
      }
    }
  };
}

// /**
//  * ## 实现未实现的路由方法
//  * * 使用astroboy的推荐写法完成默认路由实现
//  * @description
//  * @author Big Mogician
//  * @param {({
//  *   prototype: any,
//  *   method: string,
//  *   methodName: string,
//  *   auth: { rules: CtxMiddleware[], errorMsg: string, error?: any },
//  *   serviceCtor: Constructor<any> | undefined,
//  *   scopeService: boolean,
//  *   resolve: BodyResolve
//  * })} metadata
//  * @returns
//  * @exports
//  */
// export function routeMethodImplements(metadata: {
//   prototype: any;
//   method: METHOD;
//   methodName: string;
//   auth: { rules: CtxMiddleware[]; errorMsg: string; error?: any };
//   serviceCtor: Constructor<any> | undefined;
//   scopeService: boolean;
//   resolve: BodyResolve;
// }) {
//   const { prototype, method, methodName, auth, serviceCtor, resolve, scopeService: isScope } = metadata;
//   if (!prototype[methodName]) {
//     if (!serviceCtor) throw new Error("Create route method failed: init an abstract route method without a service is not allowed.");
//     if (!serviceCtor.prototype[methodName]) {
//       throw new Error(`Bind service method failed : no such method which name is "${methodName}" found in service [${serviceCtor.name}]`);
//     }
//     prototype[methodName] = async function() {
//       const data: any[] = [];
//       const queryInvoke = resolve.getQuery(this);
//       const postInvoke = resolve.getPost(this);
//       const jsonInvoke = resolve.toJson(this);
//       switch (method) {
//         case "GET": // GET方法尝试获取query
//           data.push(queryInvoke());
//           break;
//         default:
//           // 尝试获取body和query
//           data.push(postInvoke());
//           data.push(queryInvoke());
//           break;
//       }
//       if (!this.business || isScope) {
//         this.business = this[routeMeta("business")] = new serviceCtor(this.ctx);
//       }
//       // 调用business的同名函数，并用json格式要求返回结果
//       jsonInvoke(0, "success", await this.business[methodName](...data));
//     };
//   }
//   if (auth.rules.length > 0) {
//     const { rules, errorMsg, error } = auth;
//     const oldProtoMethod = prototype[methodName];
//     prototype[methodName] = async function() {
//       try {
//         for (const guard of rules) {
//           const valid = await guard(this.ctx);
//           if (valid === true) continue;
//           if (valid === false) throw error || new Error(errorMsg);
//           throw valid;
//         }
//         await oldProtoMethod.bind(this)();
//       } catch (error) {
//         throw error;
//       }
//     };
//   }
// }
