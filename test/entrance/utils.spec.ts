import { routeMeta, resolveDefaultBodyParser } from "../../src/entrance/utils";

import { expect } from "chai";
import { defineUnit } from "../unit";

defineUnit(["extrance/utils", "entrance utils"], () => {
  it("test routeMeta", () => {
    const result = routeMeta("test");
    expect(result).to.equal("@metadata::test");
  });

  it("test resolveDefaultBodyParser", () => {
    const result = resolveDefaultBodyParser();
    expect(typeof result.getPost).to.equal("function");
    expect(typeof result.getQuery).to.equal("function");
    expect(typeof result.toJson).to.equal("function");
  });
});
