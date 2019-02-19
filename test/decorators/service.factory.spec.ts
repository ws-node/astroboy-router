import * as pkg from "../../src/decorators/service.factory";

import get from "lodash/get";
import { expect } from "chai";
import { defineUnit } from "../unit";

class S {}

defineUnit(["decorators/service.factory", "decorators service"], () => {
  it("test service.service.ts features", () => {
    expect(typeof pkg.ServiceFactory(S)).to.equal("function");
    expect(pkg.ServiceFactory(S)(S, "ccc")).to.equal(undefined);
  });
});
