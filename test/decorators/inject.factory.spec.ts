import * as pkg from "../../src/decorators/inject.factory";

import { expect } from "chai";
import { defineUnit } from "../unit";

defineUnit(["decorators/inject.factory", "decorators inject"], () => {
  it("test inject.factory.ts exports", () => {
    expect(typeof pkg.InjectFactory).to.equal("function");
  });

  it("test inject.factory.ts features", () => {
    expect(typeof pkg.InjectFactory()).to.equal("function");

    expect(pkg.InjectFactory()({}, "")).to.equal(undefined);
  });
});
