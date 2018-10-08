import * as pkg from "./index";

import get from "lodash/get";
import { expect } from "chai";
import "mocha";

describe("src/extrance/index.ts", () => {

  it("test open API", () => {
    expect(get(pkg, "createRouter", undefined)).to.exist;
  });

});
