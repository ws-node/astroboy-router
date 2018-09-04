import { BaseClass } from "astroboy";
import { RouteMethod } from '../../../src';
declare class DemoController extends BaseClass {
    private business;
    getIndexHtml(): Promise<void>;
    testA: RouteMethod;
}
export = DemoController;
