import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { VAULT_PATH, PUBLIC_TAG } from "./config";

export type Page = {
  ZTITLE: string;
  ZTEXT: string;
  ZMODIFICATIONDATE: number;
  Z_PK: number;
};

const readMarkdownFiles = async (): Promise<Page[]> => {
  const files = await readdir(VAULT_PATH, {
    withFileTypes: true,
    recursive: true,
  });

  const markdownFiles = files.filter(
    (file) => file.isFile() && file.name.endsWith(".md")
  );

  const pages: Page[] = [];
  let pk = 1;

  for (const file of markdownFiles) {
    const filePath = join(file.parentPath || file.path, file.name);
    const content = await readFile(filePath, "utf-8");

    // Check if file has #public tag
    if (!content.includes(`#${PUBLIC_TAG}`)) {
      continue;
    }

    // Extract title from filename (remove .md extension)
    const title = file.name.replace(/\.md$/, "");

    // Get file stats for modification date
    const stats = await Bun.file(filePath).stat();
    const modificationDate = stats.mtime.getTime();

    pages.push({
      ZTITLE: title,
      ZTEXT: content,
      ZMODIFICATIONDATE: modificationDate,
      Z_PK: pk++,
    });
  }

  return pages;
};

let cachedPages: Page[] | null = null;

const getPages = async (): Promise<Page[]> => {
  if (!cachedPages) {
    cachedPages = await readMarkdownFiles();
  }
  return cachedPages;
};

export const queryPagesForTag = async ($tag: string): Promise<Page[]> => {
  const pages = await getPages();
  return pages.filter((page) => page.ZTEXT.includes(`#${$tag}`));
};

export const queryPageForTitle = async ($title: string): Promise<Page | undefined> => {
  const pages = await getPages();
  return pages.find((page) => page.ZTITLE === $title);
};
