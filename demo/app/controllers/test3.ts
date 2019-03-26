import { BaseClass } from "astroboy";
import { Router, API, Authorize, NoAuthorize } from "../../../src";

function check(bool: boolean) {
  return (ctx: any) => {
    return bool;
  };
}

@Router("fktest3")
@Authorize([check(false)], { errorMsg: "fuck 2!" })
class DemoController extends BaseClass {
  @API("GET", "fkb")
  // @NoAuthorize()
  public woqinm() {
    this.ctx.body = "sb";
  }
}

export = DemoController;
