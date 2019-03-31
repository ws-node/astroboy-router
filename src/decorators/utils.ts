import {
  IRouterDefine,
  IController,
  IRouter,
  IRoute,
  ArgsExtraction,
  ARGS,
  ArgsResolveStatic,
  Constructor,
  IRoutePathConfig,
  IRouteUrlPattern
} from "../metadata";
import { defaultOnBuild } from "../entrance/build";
import { defaultOnCreate } from "../entrance/create";
import { RouterMap } from "../core";

/**
 * ## 获取router配置参数
 * * 如果是第一次配置，会先做初始化和存储
 * @description
 * @author Big Mogician
 * @param {(IRouterDefine | IController)} target 控制器原型
 * @returns
 * @exports
 */
export function tryGetRouter(target: IRouterDefine | IController): IRouter<any>;
export function tryGetRouter<K extends keyof IRouter>(target: IRouterDefine | IController, key: K): IRouter<any>[K];
export function tryGetRouter(target: IRouterDefine | IController, key?: string): any {
  const routerSaved = RouterMap.get(target);
  let router: IRouter;
  router = <IRouter>routerSaved;
  if (!routerSaved) {
    router = {
      group: "",
      dependency: new Map(),
      routes: {},
      pattern: {
        sections: {},
        patterns: []
      },
      extensions: {},
      onCreate: [defaultOnCreate],
      lifeCycle: {
        onBuild: [defaultOnBuild],
        onEnter: [],
        onPipes: [],
        onQuit: []
      },
      pipes: {
        rules: []
      }
    };
    RouterMap.set(target, router);
  }
  target["@router"] = router;
  if (!key) return router;
  return (<any>router)[key];
}

/**
 * ## 获取route配置参数
 * * 如果是第一次配置当前路由项，会先做初始化和存储
 * @description
 * @author Big Mogician
 * @param {{ [key: string]: IRoute }} routes
 * @param {string} key
 * @returns
 * @exports
 */
export function tryGetRoute(routes: { [key: string]: IRoute }, key: string): IRoute;
export function tryGetRoute<K extends keyof IRoute>(routes: { [key: string]: IRoute }, key: string, subKey: K): IRoute[K];
export function tryGetRoute(routes: any, key: string, subKey?: string) {
  let route: IRoute = routes[key];
  if (!route) {
    route = routes[key] = <IRoute>{
      resolved: false,
      name: undefined,
      method: [],
      path: [],
      extensions: {},
      pathConfig: [],
      pathOverride: false,
      pathSection: [],
      args: {
        hasArgs: false,
        context: {},
        maxIndex: -1,
        solutions: []
      },
      pipes: {
        rules: [],
        extend: true
      }
    };
  }
  if (!!subKey) return (<any>route)[subKey];
  return route;
}

export function readPath({ group, pattern }: IRouter<any>, route: IRoute) {
  const { patterns = [], sections: routerSections = {} } = pattern;
  const { pathConfig: configs = [], pathOverride: override = false, pathSection } = route;
  const useRouterPatterns = !override && patterns.length > 0;
  route.path = (<(IRoutePathConfig | IRouteUrlPattern)[]>(!useRouterPatterns ? configs : patterns)).map((config, index) => {
    const { pattern: tpl, sections: data = {} } = config;
    const isPlainUrl = tpl === undefined;
    if (isPlainUrl) return (<IRoutePathConfig>config).path || "";
    const sections: { [prop: string]: any } = {
      ...routerSections,
      path: pathSection[index],
      group,
      ...data
    };
    let urlToExport: string = tpl || "";
    Object.keys(sections).forEach(key => {
      const placeholder = "{{@" + key + "}}";
      if (urlToExport.includes(placeholder)) {
        const realValue = sections[key];
        if (realValue === "" || realValue === undefined) {
          // 去掉当前section
          if (urlToExport.indexOf(`/${placeholder}`) >= 0) {
            urlToExport = urlToExport.replace(`/${placeholder}`, "");
          } else if (urlToExport.indexOf(`${placeholder}/`) >= 0) {
            urlToExport = urlToExport.replace(`${placeholder}/`, "");
          } else {
            urlToExport = urlToExport.replace(placeholder, "");
          }
        } else if (realValue === "&nbsp;") {
          // 明确需要保留当前section，场景应该比较少
          urlToExport = urlToExport.replace(placeholder, "");
        } else {
          // 正常替换section模板
          urlToExport = urlToExport.replace(placeholder, String(realValue));
        }
      }
    });
    return urlToExport;
  });
}

export function readPipes(router: IRouter, route: IRoute) {
  const { pipes: parent } = router;
  const { pipes } = route;
  route.pipes = {
    ...pipes,
    rules: pipes.extend ? [...parent.rules, ...pipes.rules] : pipes.rules,
    handler: pipes.extend ? pipes.handler || parent.handler : pipes.handler
  };
}

const defaultTransform = (d: any) => d;
const useAll: ArgsExtraction = context => context;
const useQuery: ArgsExtraction = ({ query }) => query;
const useBody: ArgsExtraction = ({ body }) => body;
const useParams: ArgsExtraction = ({ params }) => params;

export function createArgSolution(route: IRoute<any>): void {
  const { maxIndex = -1, context = {}, solutions } = route.args;
  const len = maxIndex + 1;
  if (len === 0) return;
  for (let step = 0; step < len; step++) {
    if (!context[step]) {
      solutions.push({
        extract: useAll,
        transform: defaultTransform
      });
      continue;
    }
    const { type, ctor: classTypes = [], extract, transform = defaultTransform, static: useStatic, strict: useStrict = false } = context[step];
    const staticX = typeTransform({ useStatic, type: classTypes, useStrict });
    const solution = { static: staticX, transform, type: classTypes };
    switch (type) {
      case ARGS.Custom:
        solutions.push({ ...solution, extract: extract || useAll });
        break;
      case ARGS.Query:
        solutions.push({ ...solution, extract: useQuery });
        break;
      case ARGS.Params:
        solutions.push({ ...solution, extract: useParams });
        break;
      case ARGS.BodyUrlEncoded:
      case ARGS.BodyFormData:
      case ARGS.BodyAppJson:
        solutions.push({ ...solution, extract: useBody });
        break;
      default:
        solutions.push({ ...solution, extract: extract || useAll });
        break;
    }
  }
  route.args.hasArgs = true;
}

interface ITypeTransformContext {
  type: Constructor<any>[];
  useStrict?: boolean;
  useStatic?: ArgsResolveStatic;
}

function typeTransform(context: ITypeTransformContext): ArgsResolveStatic | undefined {
  const { type: types = [], useStrict = false, useStatic } = context;
  if (!useStatic) return undefined;
  if (types.length > 1) return useStatic;
  switch (types[0]) {
    case String:
    case Number:
      return (data, opts) => useStatic((<any>types[0])(data), opts);
    case Boolean:
      return useStrict ? (data, opts) => useStatic(data === true, opts) : (data, opts) => useStatic(String(data) === "true", opts);
    // 暂时不支持其他复杂类型的类型转换处理，除非手动提供
    // TODO 支持静态类型转换
    default:
      return useStatic;
  }
}
