import * as pkg from "./index";

import get from "lodash/get";
import { expect } from "chai";
import "mocha";

describe("src/decorators/index.ts", () => {

  it("test open API", () => {
    expect(get(pkg, "Router", null)).to.exist;
    expect(get(pkg, "CustomRoute", null)).to.exist;
    expect(get(pkg, "Service", null)).to.exist;
    expect(get(pkg, "Index", null)).to.exist;
    expect(get(pkg, "API", null)).to.exist;
    expect(get(pkg, "Metadata", null)).to.exist;
    expect(get(pkg, "Auth", null)).to.exist;
    expect(get(pkg, "Authorize", null)).to.exist;
    expect(get(pkg, "NoAuthorize", null)).to.exist;
    expect(get(pkg, "Inject", null)).to.exist;
  });

});
