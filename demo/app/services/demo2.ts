import { BaseClass } from "astroboy";

class Demo2Service extends BaseClass {

  testA({ id }: any) {
    console.log("test method 2");
    return { id, origin: "demo2" }
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

export = Demo2Service;
