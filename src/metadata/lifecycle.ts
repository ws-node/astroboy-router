import { IAstroboyBaseClass, IRouter, IRoute } from "./base";

export interface IRouteLifeCycleMethod<T = IRouteBuildContext<void>> {
  (context: T, instance: IAstroboyBaseClass<T>): void | Promise<void>;
}

export interface IRouterBuildContext<P = void> {
  router: IRouter<P>;
}

export interface IRouteBuildContext<P = void> extends IRouterBuildContext<P> {
  name: string;
  route: IRoute<P>;
}

export interface IRouteBuilderDefine<T = IRouteBuildContext<void>> {
  (context: T, descriptor: IRouteDescriptor): IRouteDescriptor;
}

export interface IRouterCreateDefine<T = IRouterBuildContext<void>> {
  (context: T, prototype: any): void;
}

export type LifeCycleRegister = <K extends keyof IRouterLifeCycle>(
  name: K,
  resolver: K extends "onBuild" ? IRouteBuilderDefine : IRouteLifeCycleMethod,
  reset?: boolean
) => void;
export type OnCreateRegister = (resolver: IRouterCreateDefine, reset?: boolean) => void;

export interface IRouterEvents {
  lifecycle: LifeCycleRegister;
  create: OnCreateRegister;
}

export interface IRouteRunLifeCycle {
  onPipes: IRouteLifeCycleMethod[];
  onEnter: IRouteLifeCycleMethod[];
  onQuit: IRouteLifeCycleMethod[];
}

export interface IRouterLifeCycle extends IRouteRunLifeCycle {
  onBuild: IRouteBuilderDefine[];
}

export interface IRouteDescriptor extends PropertyDescriptor {
  value: any;
}
