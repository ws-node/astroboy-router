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

export function defaultOnBuild({ router, route, name = "" }: IRouteBuildContext, prototype: any) {
  const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
  if (!descriptor) throw new Error("Create route method failed: no method found.");
  const { lifeCycle } = router;
  const { pipes } = route;
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
        pipes.handler(this, error);
      }
    }
  };
}
