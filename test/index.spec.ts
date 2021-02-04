import * as AST_ROUTER from "../src/index";
import { expect } from "chai";
import { defineUnit } from "./unit";

defineUnit(["index", "Astroboy-router index.ts"], () => {
  it("test utils exports", () => {
    expect(Object.keys(AST_ROUTER).length, "[utils] exports count").to.equal(9);
    expect(typeof AST_ROUTER.CustomRoute, "[utils.CustomRoute] type is ").to.equal("function");
    expect(typeof AST_ROUTER.CustomPipe, "[utils.Index] type is ").to.equal("function");
    expect(typeof AST_ROUTER.FromBody, "[utils.FromBody] type is ").to.equal("function");
    expect(typeof AST_ROUTER.FromParams, "[utils.FromParams] type is ").to.equal("function");
    expect(typeof AST_ROUTER.FromQuery, "[utils.FromQuery] type is ").to.equal("function");
    expect(typeof AST_ROUTER.FromRequest, "[utils.FromRequest] type is ").to.equal("function");
    expect(typeof AST_ROUTER.Router, "[utils.Router] type is ").to.equal("function");
    expect(typeof AST_ROUTER.createRouter, "[utils.createRouter] type is ").to.equal("function");
  });
});
