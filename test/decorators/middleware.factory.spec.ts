import * as pkg from "../../src/decorators/middleware.factory";

import { expect } from "chai";
import { defineUnit } from "../unit";

class A {}

defineUnit(["decorators/middleware.factory", "Astroboy-router middleware"], () => {
  it("test middleware.factory exports", () => {
    expect(Object.keys(pkg).length).to.equal(2);
    expect(typeof pkg.MiddlewareFactory).to.equal("function");
    expect(typeof pkg.NoMiddlewareFactory).to.equal("function");
  });

  it("test middleware factoey features", () => {
    expect(typeof pkg.MiddlewareFactory([])).to.equal("function");
    expect(typeof pkg.MiddlewareFactory([], {})).to.equal("function");

    // @ts-ignore js可能的执行
    expect(pkg.MiddlewareFactory([])(A)).to.equal(undefined);
    // @ts-ignore js可能的执行
    expect(pkg.MiddlewareFactory([], {})(A)).to.equal(undefined);

    expect(pkg.MiddlewareFactory([])({}, "aaaa")).to.equal(undefined);
    expect(pkg.MiddlewareFactory([], {})({}, "bbb")).to.equal(undefined);
    expect(pkg.MiddlewareFactory([], { extend: undefined, errorMsg: undefined, error: null })({}, "bbb")).to.equal(undefined);
  });

  it("test no-middleware factoey features", () => {
    expect(typeof pkg.NoMiddlewareFactory()).to.equal("function");
    // @ts-ignore js可能的执行
    expect(pkg.NoMiddlewareFactory()(A)).to.equal(undefined);
  });
});
