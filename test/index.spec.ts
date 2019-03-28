import * as AST_ROUTER from "../src/index";
import { expect } from "chai";
import { defineUnit } from "./unit";

defineUnit(["index", "Astroboy-router index.ts"], () => {
  it("test utils exports", () => {
    expect(Object.keys(AST_ROUTER).length, "[utils] exports count").to.equal(13);
    expect(typeof AST_ROUTER.API, "[utils.API] type is ").to.equal("function");
    expect(typeof AST_ROUTER.Auth, "[utils.Auth] type is ").to.equal("function");
    expect(typeof AST_ROUTER.Authorize, "[utils.Authorize] type is ").to.equal("function");
    expect(typeof AST_ROUTER.CustomRoute, "[utils.CustomRoute] type is ").to.equal("function");
    expect(typeof AST_ROUTER.Index, "[utils.Index] type is ").to.equal("function");
    expect(typeof AST_ROUTER.Inject, "[utils.Inject] type is ").to.equal("function");
    expect(typeof AST_ROUTER.Metadata, "[utils.Metadata] type is ").to.equal("function");
    expect(typeof AST_ROUTER.NoAuthorize, "[utils.NoAuthorize] type is ").to.equal("function");
    expect(typeof AST_ROUTER.Router, "[utils.Router] type is ").to.equal("function");
    expect(typeof AST_ROUTER.Service, "[utils.Service] type is ").to.equal("function");
    expect(typeof AST_ROUTER.createRouter, "[utils.createRouter] type is ").to.equal("function");
    expect(typeof AST_ROUTER.Middlewares, "[utils.Middlewares] type is ").to.equal("function");
    expect(typeof AST_ROUTER.ClearMiddleware, "[utils.ClearMiddleware] type is ").to.equal("function");
  });
});
