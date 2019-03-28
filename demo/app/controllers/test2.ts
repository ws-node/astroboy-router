import { BaseClass } from "astroboy";
import { Router, CustomRoute } from "../../../src";

function GET(path: string) {
  return CustomRoute({
    method: "GET",
    tpls: [
      {
        tpl: "{{@group}}/{{@path}}",
        sections: { path }
      }
    ]
  });
}

@Router({
  group: "myspace",
  pipes: {
    rules: [],
    handler: error => console.log(error)
  },
  register(process) {
    process.lifecycle("onCreate", (context, proto) => {
      // console.log("onCreate");
      // console.log([context, proto]);
    });
    process.lifecycle("onEnter", (instance: any) => {
      console.log("onEnter");
      console.log([instance]);
    });
    process.lifecycle("onQuit", (instance: any) => {
      console.log("onQuit");
      console.log([instance]);
    });
    // process.onbuild((context, proto) => {
    // console.log("onBuild");
    // console.log([context, proto]);
    // });
  }
})
class Test2Controller extends BaseClass {
  @GET("testC")
  public testC() {
    console.log("wr3wtrtwr");
    this.ctx.body = { data: "wr3wtrtwr" };
  }
}

export = Test2Controller;
