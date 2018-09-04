"use strict";
const tslib_1 = require("tslib");
const astroboy_1 = require("astroboy");
const src_1 = require("../../../src");
const demo_1 = tslib_1.__importDefault(require("../services/demo"));
let DemoController = class DemoController extends astroboy_1.BaseClass {
    async getIndexHtml() {
        this.ctx.render("demo/index.html");
    }
};
tslib_1.__decorate([
    src_1.Index(["", "*"]),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], DemoController.prototype, "getIndexHtml", null);
tslib_1.__decorate([
    src_1.API("GET", "testA"),
    tslib_1.__metadata("design:type", Function)
], DemoController.prototype, "testA", void 0);
DemoController = tslib_1.__decorate([
    src_1.Router("demo"),
    src_1.Service(demo_1.default)
], DemoController);
module.exports = DemoController;
//# sourceMappingURL=demo.js.map