import run from "@bigmogician/publisher";
import { config } from "./pkg.base";

run({
  ...config,
  rc: true,
  add: 1
});
