import { BaseClass } from "astroboy";

class DemoService extends BaseClass {

  testA({ id }: any) {
    console.log("test method 1");
    return { id, origin: "demo1" }
  }

  testB(post: any, query: any) {
    return {
      post,
      query
    }
  }

  testC(query: any) {
    return {
      ...query
    }
  }

}

export = DemoService;
