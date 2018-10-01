import DemoController from "../controllers/demo";
import { createRouter } from "../../../src";

// export = createRouter(DemoController, "demo", "/test");
export = createRouter({
  router: DemoController,
  name: "demo",
  root: "/test",
  // debug: true
});