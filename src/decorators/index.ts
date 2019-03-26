import { RouterFactory } from "./router.factory";
import { CustomRouteFactory } from "./route.factory";
// import { ServiceFactory } from "./service.factory";
// import { IndexFactory, APIFactory, MetadataFactory, CustomRouteFactory } from "./route.factory";
// import { MiddlewareFactory, NoMiddlewareFactory } from "./middleware.factory";
// import { InjectFactory } from "./inject.factory";

// /** @deperacted don't use this, please use `Middlewares` instead. */
// function AuthorizeFactory(...args: any[]) {
//   return (<any>MiddlewareFactory)(...args);
// }

// /** @deperacted don't use this, please use `ClearMiddleware` instead. */
// function NoAuthorizeFactory() {
//   return NoMiddlewareFactory();
// }

export {
  RouterFactory as Router,
  // RouteFactory as Route, // 不公开
  CustomRouteFactory as CustomRoute
  // ServiceFactory as Service,
  // IndexFactory as Index,
  // APIFactory as API,
  // MetadataFactory as Metadata,
  // MiddlewareFactory as Middlewares,
  // NoMiddlewareFactory as ClearMiddleware,
  // AuthorizeFactory as Auth,
  // AuthorizeFactory as Authorize,
  // NoAuthorizeFactory as NoAuthorize,
  // InjectFactory as Inject
};
