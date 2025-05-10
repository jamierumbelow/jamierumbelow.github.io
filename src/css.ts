import { spawn } from "bun";

export const buildCss = async () => {
  spawn([
    "npx",
    "@tailwindcss/cli",
    "-i",
    "./src/input.css",
    "-o",
    "./docs/style.css",
  ]);
};
