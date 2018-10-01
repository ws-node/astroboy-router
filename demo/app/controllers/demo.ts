import { BaseClass } from "astroboy";
import { Router, Service, Index, API, RouteMethod, Authorize, Inject, NoAuthorize, CustomRoute } from "../../../src";
import DemoService from "../services/demo";
import Demo2Service from "../services/demo2";
import AuthService from "../services/auth";
import { AuthGuard } from "../../../src/metadata";

const authFac: (auth?: "admin" | "s_a") => AuthGuard = (auth) => {
  return async (ctx: AstroboyContext) => {
    let hasAccess = false;
    if (auth === "admin") hasAccess = await new AuthService(ctx).checkIsAdmin();
    else if (auth === "s_a") hasAccess = await new AuthService(ctx).checkIsSuperAdmin();
    else hasAccess = await new AuthService(ctx).checkIsLogin();
    if (!hasAccess) return new Error("鉴权失败");
    return true;
  }
};

const admin = [authFac("admin")];
const s_a = [authFac("s_a")];
const ad_sa = [...admin, ...s_a];
const meta = { error: new Error("鉴权失败") };
const scope_meta = { error: new Error("鉴权失败"), extend: false };

// @Router("demo")
// @Service(DemoService)
// @Authorize(ad_sa, meta)
@Router({
  prefix: "demo",
  apiPrefix: "xxxxxx",
  business: DemoService,
  urlTpl: {
    index: "{{@prefix}}/fk/{{@path}}",
    api: "{{@prefix}}/fk/{{@api}}/{{@path}}"
  },
  auth: {
    rules: ad_sa,
    metadata: meta
  }
})
class DemoController extends BaseClass {

  private readonly business!: DemoService;

  @Inject()
  private readonly demo2!: Demo2Service;

  @Index(["", "*"])
  public async getIndexHtml() {
    this.ctx.render("demo/index.html")
  }

  // @API("GET", "testA")
  // @API("GET", "testA", { tpl: "new/{{@api}}/different/{{@path}}" })
  @CustomRoute({ method: "GET", tpls: ["{{@api}}/{{@prefix}}/testA", "m/{{@api}}/{{@prefix}}/testA"] })
  @Service(Demo2Service)
  // @Authorize([], meta)
  public testA!: RouteMethod;

  @API("POST", "testB")
  @Authorize(admin, scope_meta)
  public testB!: RouteMethod;

  @API("GET", "testC")
  @NoAuthorize()
  public testC() {
    console.log(this.demo2);
    const result = this.demo2.testC(this.ctx.query);
    console.log(result);
    this.ctx.body = this;
  }

}

export = DemoController;
