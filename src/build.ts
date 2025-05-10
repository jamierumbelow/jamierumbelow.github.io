import { mkdir, rm } from "node:fs/promises";
import { OUT_DIR, PUBLIC_HOMEPAGE_TITLE, PUBLIC_TAG } from "./config";
import { queryPageForTitle, queryPagesForTag } from "./db";
import { md } from "./markdown";
import { buildNav } from "./nav";
import { template } from "./template";
import { copyDir, slugify } from "./utils";
import { buildCss } from "./css";

const buildPage = (page: { ZTITLE: string; ZTEXT: string }, nav: string) => {
  const slug = slugify(page.ZTITLE);

  const title = page.ZTITLE;

  const content = md.render(page.ZTEXT);

  const filename = `${slug}.html`;

  const html = template({
    title,
    nav,
    content,
  });

  return {
    filename,
    slug,
    title,
    html,
  };
};

const buildHomepage = (
  homepage: { ZTITLE: string; ZTEXT: string },
  nav: string
) => {
  const slug = slugify(homepage.ZTITLE);

  const title = homepage.ZTITLE;

  const [, , contentMd] = homepage.ZTEXT.split(/\*\*\*/);

  const content = md.render(contentMd);

  const filename = `index.html`;

  const html = template({
    title,
    nav,
    content,
  });

  return {
    filename,
    slug,
    title,
    html,
  };
};

export const build = async () => {
  const homepage = queryPageForTitle(PUBLIC_HOMEPAGE_TITLE);
  if (!homepage) {
    throw new Error(`Homepage not found for title: ${PUBLIC_HOMEPAGE_TITLE}`);
  }

  const nav = buildNav(homepage.ZTEXT);

  const pages = queryPagesForTag(PUBLIC_TAG).filter(
    (p) => p.Z_PK !== homepage.Z_PK
  );

  const builtPages = pages.map((page) => buildPage(page, nav));
  builtPages.unshift(buildHomepage(homepage, nav));

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });
  await copyDir("public", OUT_DIR);
  await buildCss();

  await Promise.all(
    builtPages.map(async (page) => {
      const { filename, html } = page;
      const filePath = `${OUT_DIR}/${filename}`;
      await Bun.write(filePath, html);
    })
  );

  console.log(`Built ${builtPages.length} pages`);
};
