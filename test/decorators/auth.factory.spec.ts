import * as pkg from "../../src/decorators/auth.factory";

import { expect } from "chai";
import { defineUnit } from "../unit";

class A {}

defineUnit(["decorators/auth.factory", "Astroboy-router auth"], () => {
  it("test auth.factory exports", () => {
    expect(Object.keys(pkg).length).to.equal(2);
    expect(typeof pkg.AuthFactory).to.equal("function");
    expect(typeof pkg.NoAuthFactory).to.equal("function");
  });

  it("test auth factoey features", () => {
    expect(typeof pkg.AuthFactory([])).to.equal("function");
    expect(typeof pkg.AuthFactory([], {})).to.equal("function");

    // @ts-ignore js可能的执行
    expect(pkg.AuthFactory([])(A)).to.equal(undefined);
    // @ts-ignore js可能的执行
    expect(pkg.AuthFactory([], {})(A)).to.equal(undefined);

    expect(pkg.AuthFactory([])({}, "aaaa")).to.equal(undefined);
    expect(pkg.AuthFactory([], {})({}, "bbb")).to.equal(undefined);
    expect(pkg.AuthFactory([], { extend: undefined, errorMsg: undefined, error: null })({}, "bbb")).to.equal(undefined);
  });

  it("test no-auth factoey features", () => {
    expect(typeof pkg.NoAuthFactory()).to.equal("function");
    // @ts-ignore js可能的执行
    expect(pkg.NoAuthFactory()(A)).to.equal(undefined);
  });
});
