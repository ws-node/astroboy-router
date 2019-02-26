import { RouterDefine, IController, IRouter, Route, UrlTplTuple } from "../metadata";
import { RouterMap } from "../core";

/**
 * ## 获取router配置参数
 * * 如果是第一次配置，先做存储
 * @description
 * @author Big Mogician
 * @param {(RouterDefine | IController)} target 控制器原型
 * @returns
 * @exports
 */
export function tryGetRouter(target: RouterDefine | IController) {
  const routerSaved = RouterMap.get(target);
  let router: IRouter;
  router = <IRouter>routerSaved;
  if (!routerSaved) {
    router = {
      prefix: "",
      apiPrefix: "api",
      routes: {},
      dependency: new Map(),
      urlTpl: [undefined, undefined],
      auth: {
        rules: [],
        errorMsg: "Auth failed."
      }
    };
    RouterMap.set(target, router);
  }
  target["@router"] = router;
  return router;
}

/**
 * ## 获取route配置参数
 * * 如果是第一次配置当前路由项，先做初始化
 * @description
 * @author Big Mogician
 * @param {{ [key: string]: Route }} routes
 * @param {string} key
 * @returns
 * @exports
 */
export function tryGetRoute(routes: { [key: string]: Route }, key: string) {
  let route = routes[key];
  if (!route) {
    route = routes[key] = {
      name: undefined,
      method: [],
      path: [],
      pathConfig: [],
      index: false,
      urlTpl: undefined,
      auth: {
        rules: [],
        extend: true,
        errorMsg: "Auth failed."
      }
    };
  }
  return route;
}

/**
 * ## 连接路由
 * * 连接router前缀和path
 * * API路由在前缀和路由根之间插入`api`层级
 * @description
 * @author Big Mogician
 * @param {string} prefix
 * @param {string} apiPrefix
 * @param {string} pathStr
 * @param {boolean} isIndex
 * @param {UrlTplTuple} tpl
 * @param {{ [key: string]: string }} tplSections
 * @returns
 * @exports
 */
export function routeConnect(prefix: string, apiPrefix: string, pathStr: string, isIndex: boolean, tpl: UrlTplTuple, tplSections: { [key: string]: string }) {
  const splits: string[] = [];
  const [indexTpl, apiTpl] = tpl || [undefined, undefined];
  // 没有重置模版，不要进入逻辑分支
  if (!!indexTpl || !!apiTpl) {
    const sections: any = {
      prefix,
      api: apiPrefix,
      path: pathStr,
      ...tplSections
    };
    if (!isIndex) sections.api = sections.api;
    let urlToExport = (!!isIndex ? indexTpl : apiTpl) || "";
    Object.keys(sections).forEach(key => {
      const placeholder = "{{@" + key + "}}";
      if (urlToExport.includes(placeholder)) {
        const realValue = sections[key];
        if (realValue === "" || realValue === undefined) {
          // 去掉当前section
          urlToExport = urlToExport.replace(`/${placeholder}`, "");
        } else if (realValue === "&nbsp;") {
          // 明确需要保留当前section，场景应该比较少
          urlToExport = urlToExport.replace(placeholder, "");
        } else {
          // 正常替换section模板
          urlToExport = urlToExport.replace(placeholder, realValue);
        }
      }
    });
    return urlToExport;
  }
  // 默认的url拼装逻辑
  // 事实上等效："{{@prefix}}/{{@path}}" 和 "api/{{@prefix}}/{{@path}}"
  if (!isIndex) splits.push(apiPrefix);
  if (prefix !== "") splits.push(prefix);
  if (!!pathStr) splits.push(pathStr);
  return splits.join("/");
}
