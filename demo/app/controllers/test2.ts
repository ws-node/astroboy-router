import { BaseClass } from "astroboy";
import { Router, CustomRoute, FromQuery } from "../../../src";

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

function Query(key: string) {
  return FromQuery({
    transform: d => d[key],
    useStatic: true
  });
}

@Router({
  group: "myspace",
  pipes: {
    rules: [],
    handler: error => console.log(error)
  }
})
class Test2Controller extends BaseClass {
  @GET("testC")
  public testC(@Query("id") id: number, @FromQuery() query: any) {
    console.log(id);
    console.log(typeof id);
    this.ctx.body = { data: id, query };
  }
}

export = Test2Controller;
