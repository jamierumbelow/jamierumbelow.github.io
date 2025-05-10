import { spawn } from "bun";

export const deploy = async () => {
  let proc = spawn(["git", "add", "."]);
  await proc.exited;
  proc = spawn(["git", "commit", "-m", `deploy ${new Date().toISOString()}`]);
  await proc.exited;
  proc = spawn(["git", "push"]);
  await proc.exited;
};
