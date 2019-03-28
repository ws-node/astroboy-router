import { IRouter, IRouterBuildContext } from "../metadata";

export function buildRouterInstance(prototype: any, router: IRouter) {
  const { onCreate = [] } = router;
  try {
    for (const each of onCreate) {
      each({ router }, prototype);
    }
  } catch (error) {
    // tslint:disable-next-line: no-console
    console.error(error);
    throw new Error("Create router class failed");
  }
}

export function defaultOnCreate({ router }: IRouterBuildContext, prototype: any) {
  // DO NOTHING
}
