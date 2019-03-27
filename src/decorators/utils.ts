import { IRouterDefine, IController, IRouter, IRoute } from "../metadata";
import { defaultOnBuild } from "../entrance/route-implements";
import { defaultOnCreate } from "../entrance/service-init";
import { RouterMap } from "../core";

/**
 * ## 获取router配置参数
 * * 如果是第一次配置，先做存储
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
 * * 如果是第一次配置当前路由项，先做初始化
 * @description
 * @author Big Mogician
 * @param {{ [key: string]: IRoute }} routes
 * @param {string} key
 * @returns
 * @exports
 */
export function tryGetRoute(routes: { [key: string]: IRoute }, key: string) {
  let route = routes[key];
  if (!route) {
    route = routes[key] = {
      resolved: false,
      name: undefined,
      method: [],
      path: [],
      extensions: {},
      pathConfig: [],
      pipes: {
        rules: [],
        extend: true
      }
    };
  }
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
