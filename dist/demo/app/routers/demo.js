"use strict";
const tslib_1 = require("tslib");
const demo_1 = tslib_1.__importDefault(require("../controllers/demo"));
const src_1 = require("../../../src");
module.exports = src_1.createRouter(demo_1.default, "demo", "/test");
//# sourceMappingURL=demo.js.map