import { routeMeta, resolveDefaultBodyParser } from "./utils";

import { expect } from "chai";
import "mocha";

describe("src/extrance/utils.ts", () => {

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
