import { BaseClass } from "astroboy";
declare class DemoService extends BaseClass {
    testA({ id }: any): {
        code: number;
        msg: string;
        data: {
            id: any;
        };
    };
}
export = DemoService;
