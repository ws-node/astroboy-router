import { BaseClass } from "astroboy";

class DemoService extends BaseClass {

  testA({ id }: any) {
    return { id }
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
