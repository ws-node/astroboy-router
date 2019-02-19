import * as pkg from "../../src/decorators/router.factory";

import get from "lodash/get";
import { expect } from "chai";
import { defineUnit } from "../unit";
import { APIFactory, CustomRouteFactory } from "../../src/decorators/route.factory";

class X {}

defineUnit(["decorators/router.factory", "decorators router"], () => {
  it("test router.factory.ts exports", () => {
    expect(typeof pkg.RouterFactory).to.equal("function");
  });

  it("test router.factory.ts features", () => {
    expect(typeof pkg.RouterFactory("xxxx")).to.equal("function");

    APIFactory("GET", "xxx")(X.prototype, "cccc");
    CustomRouteFactory({ method: "GET", tpls: ["444"] })(X.prototype, "bbb");
    expect(pkg.RouterFactory("xxxx")(X)).to.equal(X);
    expect(pkg.RouterFactory({ prefix: "vvvv", business: X, auth: { rules: [], metadata: {} } })(X)).to.equal(X);
    expect(pkg.RouterFactory({ prefix: "vvvv", business: X, auth: { rules: [] } })(X)).to.equal(X);
  });
});
