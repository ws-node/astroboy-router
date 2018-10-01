import { RouterFactory } from "./router.factory";
import { ServiceFactory } from './service.factory';
import { IndexFactory, APIFactory, MetadataFactory } from "./route.factory";
import { AuthFactory, NoAuthFactory } from './auth.factory';
import { InjectFactory } from "./inject.factory";

export {
  RouterFactory as Router,
  // RouteFactory as Route, // 不公开
  ServiceFactory as Service,
  IndexFactory as Index,
  APIFactory as API,
  MetadataFactory as Metadata,
  AuthFactory as Auth,
  AuthFactory as Authorize,
  NoAuthFactory as NoAuthorize,
  InjectFactory as Inject
};
