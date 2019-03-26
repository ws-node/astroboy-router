import { AuthGuard, Route, Constructor, BodyResolve, METHOD } from "../metadata";
import { routeMeta } from "./utils";

/**
 * ## 实现未实现的路由方法
 * * 使用astroboy的推荐写法完成默认路由实现
 * @description
 * @author Big Mogician
 * @param {({
 *   prototype: any,
 *   method: string,
 *   methodName: string,
 *   auth: { rules: AuthGuard[], errorMsg: string, error?: any },
 *   serviceCtor: Constructor<any> | undefined,
 *   scopeService: boolean,
 *   resolve: BodyResolve
 * })} metadata
 * @returns
 * @exports
 */
export function routeMethodImplements(metadata: {
  prototype: any;
  method: METHOD;
  methodName: string;
  auth: { rules: AuthGuard[]; errorMsg: string; error?: any };
  serviceCtor: Constructor<any> | undefined;
  scopeService: boolean;
  resolve: BodyResolve;
}) {
  const { prototype, method, methodName, auth, serviceCtor, resolve, scopeService: isScope } = metadata;
  if (!prototype[methodName]) {
    if (!serviceCtor) throw new Error("Create route method failed: init an abstract route method without a service is not allowed.");
    if (!serviceCtor.prototype[methodName]) {
      throw new Error(`Bind service method failed : no such method which name is "${methodName}" found in service [${serviceCtor.name}]`);
    }
    prototype[methodName] = async function() {
      const data: any[] = [];
      const queryInvoke = resolve.getQuery(this);
      const postInvoke = resolve.getPost(this);
      const jsonInvoke = resolve.toJson(this);
      switch (method) {
        case "GET": // GET方法尝试获取query
          data.push(queryInvoke());
          break;
        default:
          // 尝试获取body和query
          data.push(postInvoke());
          data.push(queryInvoke());
          break;
      }
      if (!this.business || isScope) {
        this.business = this[routeMeta("business")] = new serviceCtor(this.ctx);
      }
      // 调用business的同名函数，并用json格式要求返回结果
      jsonInvoke(0, "success", await this.business[methodName](...data));
    };
  }
  if (auth.rules.length > 0) {
    const { rules, errorMsg, error } = auth;
    const oldProtoMethod = prototype[methodName];
    prototype[methodName] = async function() {
      try {
        for (const guard of rules) {
          const valid = await guard(this.ctx);
          if (valid === true) continue;
          if (valid === false) throw error || new Error(errorMsg);
          throw valid;
        }
        await oldProtoMethod.bind(this)();
      } catch (error) {
        throw error;
      }
    };
  }
}
