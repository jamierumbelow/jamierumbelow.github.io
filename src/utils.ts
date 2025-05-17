import { createHash } from "crypto";
import { copyFile, readdir, mkdir } from "fs/promises";

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .replace(/--+/g, "-");

export const copyDir = async (src: string, dest: string) => {
  const files = await readdir(src, { withFileTypes: true, recursive: true });

  for (const file of files) {
    const srcPath = `${file.parentPath}/${file.name}`;
    const pathSegments = srcPath.split("/");
    const destPathSegments = pathSegments.slice(1);
    const destPath = `${dest}/${destPathSegments.join("/")}`;

    if (file.isDirectory()) {
      await mkdir(destPath, { recursive: true });
    } else {
      await copyFile(srcPath, destPath);
    }
  }
};

export const appleEpochDateToDate = (epoch: number): Date => {
  const appleTimestamp = 769198670.369512;
  const appleEpoch = new Date("2001-01-01T00:00:00Z");
  const date = new Date(appleEpoch.getTime() + appleTimestamp * 1000);
  return date;
};

export const fileHash = async (filePath: string) => {
  const file = await Bun.file(filePath);
  const fileBuffer = await file.text();
  const hash = createHash("sha256").update(fileBuffer).digest("hex");
  return hash;
};

export const parseTags = (text: string) =>
  text.replaceAll(
    /#\w+/g,
    '<span class="px-2 py-1 rounded-full bg-blue-200 text-blue-900 border-blue-900 font-semibold">$&</span>'
  );
