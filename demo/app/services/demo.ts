import { BaseClass } from "astroboy";

class DemoService extends BaseClass {

  testA({ id }: any) {
    return {
      code: 0,
      msg: "success",
      data: { id }
    }
  }

}

export = DemoService;
