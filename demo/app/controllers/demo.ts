import { BaseClass } from "astroboy";
import { Router, Service, Index, API, RouteMethod } from '../../../src';
import DemoService from "../services/demo";

@Router("demo")
@Service(DemoService)
class DemoController extends BaseClass {

  private business!: DemoService;

  @Index(["", "*"])
  public async getIndexHtml() {
    this.ctx.render("demo/index.html")
  }

  @API("GET", "testA")
  public testA!: RouteMethod;

}

export = DemoController;
