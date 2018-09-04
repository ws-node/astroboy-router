import DemoController from "../controllers/demo";
import { createRouter } from '../../../src';

export = createRouter(DemoController, "demo", "/test");
