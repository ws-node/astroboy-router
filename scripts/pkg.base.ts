import { IConfig } from "@bigmogician/publisher/actions";

export const config: IConfig = {
  rc: false,
  add: 0,
  useYarn: false,
  whiteSpace: "  ",
  debug: false,
  register: "https://registry.npmjs.org",
  outTransform: (json) => ({
    ...json,
    main: "index.js",
    types: "index.d.ts",
    scripts: undefined,
    nyc: undefined,
    devDependencies: undefined,
  }),
};
