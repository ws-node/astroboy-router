import { BaseClass } from "astroboy";
import { Router, Service, Index, API, RouteMethod, Auth, Inject } from '../../../src';
import DemoService from "../services/demo";
import Demo2Service from "../services/demo2";
import AuthService from "../services/auth";
import { AuthGuard } from '../../../src/metadata';

const authFac: (auth?: "admin" | "s_a") => AuthGuard = (auth) => {
  return async (ctx: AstroboyContext) => {
    if (auth === "admin")
      return await new AuthService(ctx).checkIsAdmin();
    else if (auth === "s_a")
      return await new AuthService(ctx).checkIsSuperAdmin();
    else
      return await new AuthService(ctx).checkIsLogin();
  }
};

const admin = [authFac("admin")];
const s_a = [authFac("s_a")];
const ad_sa = [...admin, ...s_a];
const meta = { error: new Error("鉴权失败") };
const scope_meta = { error: new Error("鉴权失败"), extend: false };

@Router("demo")
@Service(DemoService)
@Auth(ad_sa, meta)
class DemoController extends BaseClass {

  private readonly business!: DemoService;

  @Inject()
  private readonly demo2!: Demo2Service;

  @Index(["", "*"])
  public async getIndexHtml() {
    this.ctx.render("demo/index.html")
  }

  @API("GET", "testA")
  @Service(Demo2Service)
  @Auth([], meta)
  public testA!: RouteMethod;

  @API("POST", "testB")
  @Auth(admin, scope_meta)
  public testB!: RouteMethod;

  @API("GET", "testC")
  @Auth([], { extend: false })
  public testC() {
    console.log(this.demo2);
    const result = this.demo2.testC(this.ctx.query);
    console.log(result);
    this.ctx.body = this;
  }

}

export = DemoController;
