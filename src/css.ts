import { spawn } from "bun";

export const buildCss = async () => {
  const proc = spawn([
    "npx",
    "@tailwindcss/cli",
    "-i",
    "./src/input.css",
    "-o",
    "./docs/style.css",
  ]);
  await proc.exited;
};
