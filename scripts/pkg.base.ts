import { IConfig } from "@bigmogician/publisher/actions";

export const config: IConfig = {
  rc: false,
  useYarn: true,
  whiteSpace: "  ",
  debug: false,
  outTransform: json => ({
    ...json,
    main: "index.js",
    types: "index.d.ts",
    scripts: undefined,
    nyc: undefined,
    devDependencies: undefined
  })
};
