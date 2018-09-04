"use strict";
const astroboy_1 = require("astroboy");
class DemoService extends astroboy_1.BaseClass {
    testA({ id }) {
        return {
            code: 0,
            msg: "success",
            data: { id }
        };
    }
}
module.exports = DemoService;
//# sourceMappingURL=demo.js.map