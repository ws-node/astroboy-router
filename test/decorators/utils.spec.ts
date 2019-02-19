import { tryGetRouter, tryGetRoute, routeConnect } from "../../src/decorators/utils";
import { RouterDefine } from "../../src/metadata";

import { expect } from "chai";
import { defineUnit } from "../unit";

class TEST implements RouterDefine {}

defineUnit(["decorators/utils", "decorators' utils"], () => {
  it("test tryGetRouter", () => {
    const result = tryGetRouter(TEST.prototype);
    expect(result.apiPrefix).to.equal("api");
    expect(Object.prototype.toString.call(result.dependency)).to.equal("[object Map]");
    expect(result.prefix).to.equal("");
    expect(Object.keys(result.routes).length).to.equal(0);
    expect(typeof result.auth).to.equal("object");
    expect(Object.keys(result.auth.rules).length).to.equal(0);
  });

  it("test tryGetRoute", () => {
    const result = tryGetRoute({}, "test");
    expect(result.index).to.equal(false);
    expect(Object.keys(result.method).length).to.equal(0);
    expect(result.name).to.equal(undefined);
    expect(Object.keys(result.path).length).to.equal(0);
    expect(result.service).to.equal(undefined);
    expect(Object.keys(result.auth).length).to.equal(3);
  });

  it("test routeConnect", () => {
    const apiResult = routeConnect("testPrifix", "testApiPrefix", "testPath", false, [undefined, undefined], {});
    expect(apiResult).to.equal("testApiPrefix/testPrifix/testPath");

    const apiResult_x01 = routeConnect("testPrifix", "testApiPrefix", "testPath", false, [undefined, undefined], { api: "xxxxxxAPi" });
    expect(apiResult_x01).to.equal("testApiPrefix/testPrifix/testPath");

    const apiResult2 = routeConnect("testPrifix", "testApiPrefix", "testPath", false, [undefined, "custom/{{@api}}/xxx/{{@path}}"], {});
    expect(apiResult2).to.equal("custom/testApiPrefix/xxx/testPath");

    const apiResult2_x01 = routeConnect("testPrifix", "testApiPrefix", "testPath", false, [undefined, "custom/{{@api}}/xxx/{{@path}}"], { api: "xxxxxxAPi" });
    expect(apiResult2_x01).to.equal("custom/xxxxxxAPi/xxx/testPath");

    const indexResult = routeConnect("testPrifix", "testApiPrefix", "testPath", true, [undefined, undefined], {});
    expect(indexResult).to.equal("testPrifix/testPath");

    const indexResult2 = routeConnect("testPrifix", "testApiPrefix", "testPath", true, ["custom/{{@prefix}}/xxx/{{@path}}", undefined], {
      prefix: "fk________prefix"
    });
    expect(indexResult2).to.equal("custom/fk________prefix/xxx/testPath");
  });
});
