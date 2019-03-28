import { IRouterDefine, IController, IRouter, IRoute, ArgTransform, ArgSolution, IArgsSolutionsContext, ARGS } from "../metadata";
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

export function readPath(group: string, route: IRoute) {
  const { pathConfig: configs = [] } = route;
  route.path = configs.map(config => {
    const { path, urlTpl: tpl, sections: data = {} } = config;
    const isPlainUrl = tpl === undefined;
    if (isPlainUrl) return path || "";
    const sections: { [prop: string]: any } = { path, group, ...data };
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
const useAll: ArgSolution = context => context;
const useQuery: ArgSolution = ({ query }) => query;
const useBody: ArgSolution = ({ body }) => body;
const useParams: ArgSolution = ({ params }) => params;

export function createArgsSolution(route: IRoute<any>): void {
  const { maxIndex = -1, context = {}, solutions } = route.args;
  const len = maxIndex + 1;
  if (len === 0) return;
  for (let step = 0; step < len; step++) {
    const { type, ctor: classType, resolver = defaultTransform, static: useStatic = false } = context[step];
    if (!context[step]) {
      solutions.push([useAll, resolver]);
      continue;
    }
    switch (type) {
      case ARGS.Query:
        solutions.push([useQuery, typeTransform({ resolver, useStatic, type: classType, strictBool: false })]);
        break;
      case ARGS.Params:
        solutions.push([useParams, typeTransform({ resolver, useStatic, type: classType, strictBool: false })]);
        break;
      // 默认按照 application/json 处理
      default:
        solutions.push([useBody, typeTransform({ resolver, useStatic, type: classType })]);
        break;
    }
  }
  route.args.hasArgs = true;
}

interface ITypeTransformContext {
  type: any;
  resolver: ArgTransform;
  strictBool?: boolean;
  useStatic?: boolean;
}

function typeTransform(context: ITypeTransformContext): ArgTransform {
  const { type, resolver, strictBool = true, useStatic = false } = context;
  if (!useStatic) return resolver;
  switch (type) {
    case String:
    case Number:
      return d => type(resolver(d));
    case Boolean:
      return strictBool ? d => resolver(d) === true : d => String(resolver(d)) === "true";
    // 暂时不支持其他复杂类型的类型转换处理
    // TODO 支持静态类型转换
    default:
      return resolver;
  }
}
