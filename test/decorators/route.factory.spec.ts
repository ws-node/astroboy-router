import * as pkg from "../../src/decorators/route.factory";

import { expect } from "chai";
import { defineUnit } from "../unit";

defineUnit(["decorators/route.factory", "decorators route"], () => {
  it("test route.factory.ts exports", () => {
    expect(Object.keys(pkg).length).to.equal(4);
  });

  it("test route.factory.ts fearures", () => {
    expect(typeof pkg.APIFactory("GET", "aaaaaa")).to.equal("function");
    expect(typeof pkg.APIFactory("POST", "aaaaaa")).to.equal("function");
    expect(typeof pkg.APIFactory("PUT", "aaaaaa")).to.equal("function");
    expect(typeof pkg.APIFactory("DELETE", "aaaaaa")).to.equal("function");

    expect(pkg.APIFactory("GET", "aaaaaa")({}, "")).to.equal(undefined);
    expect(pkg.APIFactory("POST", "aaaaaa")({}, "")).to.equal(undefined);
    expect(pkg.APIFactory("PUT", "aaaaaa")({}, "")).to.equal(undefined);
    expect(pkg.APIFactory("DELETE", "aaaaaa")({}, "")).to.equal(undefined);
    expect(pkg.APIFactory("DELETE", "aaaaaa", { name: "sb" })({}, "")).to.equal(undefined);

    expect(pkg.IndexFactory(["xxxxx", "aaaaaa"])({}, "")).to.equal(undefined);
    expect(pkg.IndexFactory(["xxxxx", "aaaaaa"], { name: "sb" })({}, "")).to.equal(undefined);

    expect(pkg.CustomRouteFactory({ method: "GET", tpls: [] })({}, "")).to.equal(undefined);
    expect(pkg.CustomRouteFactory({ method: "GET", tpls: ["xxx", "bbb"], name: "ccc", isIndex: false })({}, "")).to.equal(undefined);
  });
});
