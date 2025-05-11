import { spawn } from "bun";

export const deploy = async () => {
  let proc = spawn(["git", "status"]);
  const text = await new Response(proc.stdout).text();
  if (text.includes("nothing to commit")) {
    console.log("Nothing to deploy");
    return;
  }
  await proc.exited;

  proc = spawn(["git", "add", "."]);
  await proc.exited;
  proc = spawn(["git", "commit", "-m", `deploy ${new Date().toISOString()}`]);
  await proc.exited;
  proc = spawn(["git", "push"]);
  await proc.exited;
};
