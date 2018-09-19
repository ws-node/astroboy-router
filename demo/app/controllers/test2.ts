import { BaseClass } from "astroboy";
import { Router, Service, Index, API, RouteMethod, Authorize, Inject, NoAuthorize } from '../../../src';


@Router("")
class Test2Controller extends BaseClass {

  @Index(["", "*"])
  public async getIndexHtml() {
    this.ctx.render("demo/index.html")
  }

  @API("GET", "testC")
  public testC() {
    this.ctx.body = {};
  }

}

export = Test2Controller;
