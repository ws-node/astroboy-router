export * from "./entrance";
export * from "./decorators";
import { RouteMethod, CtxMiddleware } from "./metadata";

/** @deperacted don't use this type, replace it with `CtxMiddleware` */
export type AuthGuard = CtxMiddleware;

export { RouteMethod, CtxMiddleware };
