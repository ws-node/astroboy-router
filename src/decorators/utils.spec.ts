import { tryGetRouter, tryGetRoute, routeConnect } from "./utils";
import { IController, RouterDefine } from "../metadata";

import { expect } from "chai";
import "mocha";

class TEST implements RouterDefine { }

describe("src/decorators/utils.ts", () => {

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
    expect(result.method).to.equal("GET");
    expect(result.name).to.equal(undefined);
    expect(result.path).to.equal("");
    expect(result.service).to.equal(undefined);
    expect(Object.keys(result.auth).length).to.equal(3);
  });

  it("test routeConnect", () => {
    const apiResult = routeConnect("testPrifix", "testApiPrefix", "testPath", false);
    expect(apiResult).to.equal("testApiPrefix/testPrifix/testPath");
    const indexResult = routeConnect("testPrifix", "testApiPrefix", "testPath", true);
    expect(indexResult).to.equal("testPrifix/testPath");
  });

});
