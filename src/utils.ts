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

export const parseTags = (text: string) =>
  text.replaceAll(
    /#\w+/g,
    '<span class="px-2 py-1 rounded-full bg-blue-200 text-blue-900 border-blue-900 font-semibold">$&</span>'
  );
