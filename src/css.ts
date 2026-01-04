import { spawn } from "bun";
import { join } from "path";

export const buildCss = async () => {
  const tailwindPath = join(process.cwd(), "node_modules", ".bin", "tailwindcss");
  const proc = spawn([
    tailwindPath,
    "-i",
    "./src/input.css",
    "-o",
    "./docs/style.css",
  ]);
  await proc.exited;
};
