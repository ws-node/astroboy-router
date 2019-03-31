import {
  IRoute,
  IRouter,
  IRouteBuildContext,
  IPipeResolveContext,
  IRouterLifeCycle,
  IArgSolutionsContext,
  IRouteDescriptor,
  IParseArgsOptions
} from "../metadata";

export function buildRouteMethod(prototype: any, methodName: string, router: IRouter, route: IRoute) {
  const { lifeCycle = {} } = router;
  const onBuild = lifeCycle.onBuild || [];
  try {
    let descriptor = Object.getOwnPropertyDescriptor(prototype, methodName);
    if (!descriptor) throw new Error("Create route method failed: no method found.");
    if (!descriptor.value) throw new Error("Create route method failed: route method is not implemented.");
    for (const eachBuild of onBuild) {
      descriptor = eachBuild({ router, route, name: methodName }, <any>descriptor);
    }
    Object.defineProperty(prototype, methodName, descriptor);
  } catch (error) {
    // tslint:disable-next-line: no-console
    console.error(error);
    throw new Error("Create route method failed");
  }
}

export function defaultOnBuild(context: IRouteBuildContext, descriptor: IRouteDescriptor) {
  const { lifeCycle } = context.router;
  const { pipes } = context.route;
  const needPipe = pipes.rules.length > 0;
  const needOnPipe = (lifeCycle.onPipes || []).length > 0;
  const needOnEnter = (lifeCycle.onEnter || []).length > 0;
  const needOnQuit = (lifeCycle.onQuit || []).length > 0;
  const sourceRouteMethod: (...args: any[]) => Promise<any> = descriptor.value;
  const hooks = createLifeHooks(lifeCycle);
  const helpers = createBuildHelper(context);
  descriptor.value = async function() {
    if (needOnPipe) await hooks.runOnPipes.call(this);
    if (needPipe) await hooks.runPipes.call(this, pipes);
    if (needOnEnter) await hooks.runOnEnters.call(this);
    const args = helpers.parseArgs.call(this);
    await sourceRouteMethod.call(this, ...args);
    if (needOnQuit) await hooks.runOnQuits.call(this);
  };
  return descriptor;
}

/**
 * ## 创建路由构建辅助函数
 * * 方便改造onBuild
 * * 确保使用call(this)调用
 *
 * @author Big Mogician
 * @export
 * @param {IRouteBuildContext<any>} { route }
 */
export function createBuildHelper({ route }: IRouteBuildContext<any>) {
  const { args } = route;
  return {
    /**
     * 解析注入参数
     *
     * @author Big Mogician
     * @param {any} this delegator
     * @param {Partial<IParseArgsOptions>} [options={}]
     */
    parseArgs(this: any, options: Partial<IParseArgsOptions> = {}) {
      const { fetchArgs = defaultFetchArgs } = options;
      if (!args.hasArgs) return [];
      const context = fetchArgs(this);
      return args.solutions.map(({ extract: fetch, transform, static: typeResolve, type }) => {
        return !typeResolve ? transform(fetch(context)) : typeResolve(transform(fetch(context)), { ...options, type });
      });
    }
  };
}

function defaultFetchArgs(delegator: any): IArgSolutionsContext {
  return {
    query: delegator.ctx.query || {},
    params: delegator.ctx.params || {},
    body: delegator.ctx.request.body || {}
  };
}

/**
 * ## 创建路由生命周期钩子辅助函数
 * * 方便改造onBuild
 * * 确保使用call(this)调用
 *
 * @author Big Mogician
 * @export
 * @param {Partial<IRouterLifeCycle>} lifeCycle
 */
export function createLifeHooks(lifeCycle: Partial<IRouterLifeCycle>) {
  return {
    /**
     * 执行OnPipes生命周期
     * * async
     *
     * @author Big Mogician
     * @param {any} this
     */
    async runOnPipes(this: any) {
      for (const eachOnPipe of lifeCycle.onPipes || []) {
        await eachOnPipe(this);
      }
    },
    /**
     * 执行OnEnter生命周期
     * * async
     *
     * @author Big Mogician
     * @param {any} this
     */
    async runOnEnters(this: any) {
      for (const eachOnEnter of lifeCycle.onEnter || []) {
        await eachOnEnter(this);
      }
    },
    /**
     * 执行OnQuit生命周期
     * * async
     *
     * @author Big Mogician
     * @param {any} this
     */
    async runOnQuits(this: any) {
      for (const eachOnQuit of lifeCycle.onQuit || []) {
        await eachOnQuit(this);
      }
    },
    /**
     * 执行pipes逻辑
     * * async
     *
     * @author Big Mogician
     * @param {any} this
     * @param {IPipeResolveContext<void>} pipes
     */
    async runPipes(this: any, pipes: IPipeResolveContext<void>) {
      try {
        for (const eachPipe of pipes.rules || []) {
          await eachPipe(this);
        }
      } catch (error) {
        if (!pipes.handler) {
          throw error;
        }
        pipes.handler(this, error);
      }
    }
  };
}
