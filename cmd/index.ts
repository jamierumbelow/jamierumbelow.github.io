import { parseArgs } from "util";
import { build } from "../src/build";

const { values, positionals } = parseArgs({
  arg: Bun.argv,
  options: {},
  allowPositionals: true,
});

switch (positionals[0]) {
  case "build":
    await build();
    break;

  default:
    throw new Error(`Unknown command '${positionals[0]}'`);
}
