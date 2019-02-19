import * as pkg from "../../src/entrance/index";

import get from "lodash/get";
import { expect } from "chai";
import { defineUnit } from "../unit";
import { RouterFactory } from "../../src/decorators/router.factory";
import { APIFactory, MetadataFactory, IndexFactory } from "../../src/decorators/route.factory";
import { ServiceFactory } from "../../src/decorators/service.factory";
import { InjectFactory } from "../../src/decorators/inject.factory";

class DS {
  ffffff() {}
}

class DSS {
  ffffff() {}
}

class S {
  fdgrbes() {}
  sgawg() {}
}

class XSS {}

class XXSS {}

const SS = RouterFactory("ccccc")(S);

IndexFactory(["sdfaf", "sadvdf"])(S.prototype, "sgawg");
APIFactory("GET", "cdawev")(S.prototype, "fdgrbes");
MetadataFactory("sdfsa")(S.prototype, "fdgrbes");
ServiceFactory(DS)(S.prototype, "ffffff");
APIFactory("GET", "wrgvbawe")(S.prototype, "ffffff");

APIFactory("GET", "fbsbf")(XSS.prototype, "eeeeee");
APIFactory("GET", "fbsbf")(XXSS.prototype, "eeeeee");

defineUnit(["extrance/index", "entrance main"], () => {
  it("test open API", () => {
    expect(get(pkg, "createRouter", undefined)).to.exist;
    try {
      expect(pkg.createRouter(DS, "543", "xxx34536xx")).to.exist;
    } catch (e) {
      expect(e.message).to.includes("Create router failed : invalid router controller");
    }

    expect(pkg.createRouter(SS, "xxx", "xxxxx")).to.exist;
    expect(
      pkg.createRouter({
        name: "dfvsv",
        router: SS,
        root: "sdfasdf",
        debug: true
      })
    ).to.exist;
  });

  try {
    expect(pkg.createRouter(XSS, "3452324rewg", "xxxerwgwrgxx")).to.exist;
  } catch (e) {
    expect(e.message).to.includes("Create route method failed: init an abstract route method without a service is not allowed.");
  }

  InjectFactory()(XXSS.prototype, "xxxxxx");
  InjectFactory()(XXSS.prototype, "yyyyyy");
  InjectFactory()(XXSS.prototype, "zzzzzz");
  InjectFactory()(XXSS.prototype, "business");

  try {
    expect(pkg.createRouter(XXSS, "3452324rewg", "xxxerwgwrgxx")).to.exist;
  } catch (e) {
    expect(e.message).to.includes("Inject service failed: you can not define business service manually on router");
  }

  ServiceFactory(DSS)(XSS.prototype, "eeeeee");

  try {
    expect(pkg.createRouter(XSS, "3452324rewg", "xxxerwgwrgxx")).to.exist;
  } catch (e) {
    expect(e.message).to.includes("Bind service method failed : no such method which name is");
  }
});
