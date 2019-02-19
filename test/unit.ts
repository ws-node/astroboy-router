import "mocha";
import * as path from "path";

export function defineUnit(filePath: string, fn: (this: Mocha.Suite) => void): Mocha.Suite;
export function defineUnit(pathAndDesc: [string, string], fn: (this: Mocha.Suite) => void): Mocha.Suite;
export function defineUnit(args: string | [string, string], fn: (this: Mocha.Suite) => void) {
  const [filePath, desc] = args instanceof Array ? args : [args, undefined];
  return describe(
    `${!desc ? "--------" : `--------\n  ${desc}\n  \n`}\n  [src]  ${path.resolve(process.cwd(), `src/${filePath}.ts`)}\n  [test] ${path.resolve(
      process.cwd(),
      `test/${filePath}.spec.ts\n`
    )}`,
    fn
  );
}
