import * as pkg from "./index";

import get from "lodash/get";
import { expect } from "chai";
import "mocha";

describe("src/decorators/index.ts", () => {

  it("test open API", () => {
    expect(get(pkg, "Router", undefined)).to.exist;
    expect(get(pkg, "CustomRoute", undefined)).to.exist;
    expect(get(pkg, "Service", undefined)).to.exist;
    expect(get(pkg, "Index", undefined)).to.exist;
    expect(get(pkg, "API", undefined)).to.exist;
    expect(get(pkg, "Metadata", undefined)).to.exist;
    expect(get(pkg, "Auth", undefined)).to.exist;
    expect(get(pkg, "Authorize", undefined)).to.exist;
    expect(get(pkg, "NoAuthorize", undefined)).to.exist;
    expect(get(pkg, "Inject", undefined)).to.exist;
  });

});
