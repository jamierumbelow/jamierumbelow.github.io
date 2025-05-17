import { mkdir, rm } from "node:fs/promises";
import { OUT_DIR, PUBLIC_HOMEPAGE_TITLE, PUBLIC_TAG } from "./config";
import { queryPageForTitle, queryPagesForTag } from "./db";
import { md } from "./markdown";
import { buildNav } from "./nav";
import { template } from "./template";
import { appleEpochDateToDate, copyDir, fileHash, slugify } from "./utils";
import { buildCss } from "./css";
import { compileBooks } from "./books";

const normaliseContent = (content: string) => {
  // remove the first line
  const lines = content.split("\n");
  const rest = lines.slice(1).join("\n");
  let normalised = rest;
  // remove the public tag
  normalised = normalised.replaceAll("#" + PUBLIC_TAG, "");
  // done
  return normalised;
};

const compileSpecials = async (text: string) => {
  let content = text;
  // replace {{books}} with the books list
  content = await compileBooks(content);
  return content;
};

const buildPage = async (
  page: { ZTITLE: string; ZTEXT: string; ZMODIFICATIONDATE: number },
  nav: string
) => {
  const slug = slugify(page.ZTITLE);

  const title = page.ZTITLE;

  const content = md.render(normaliseContent(page.ZTEXT));

  const cssHash = `?v=${await fileHash("docs/style.css")}`;

  const filename = `${slug}.html`;

  const lastUpdated = appleEpochDateToDate(page.ZMODIFICATIONDATE);

  let html = template({
    title,
    nav,
    content,
    cssHash,
    lastUpdated,
  });

  html = await compileSpecials(html);

  return {
    filename,
    slug,
    title,
    html,
  };
};

const buildHomepage = async (
  homepage: { ZTITLE: string; ZTEXT: string },
  nav: string
) => {
  const slug = "home";

  const title = "home";

  const [, , contentMd] = homepage.ZTEXT.split(/\*\*\*/);

  const content = md.render(contentMd);

  const cssHash = `?v=${await fileHash("docs/style.css")}`;

  const filename = `index.html`;

  const html = template({
    title,
    nav,
    content,
    cssHash,
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

  const builtPages = await Promise.all(
    pages.map((page) => buildPage(page, nav))
  );
  builtPages.unshift(await buildHomepage(homepage, nav));

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
