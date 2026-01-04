import { PUBLIC_TAG } from "./config";
import { queryPageForTitle } from "./db";
import { md } from "./markdown";
import { slugify } from "./utils";

export const buildNav = async (homepageText: string) => {
  const [, nav] = homepageText.split(/\*\*\*/);

  const itemPromises = nav
    .split(/\n/)
    .map(async (item) => {
      const title = item.replace(/^\[\[(.+)\]\]$/, "$1");
      if (title === "") {
        return false;
      }

      const page = await queryPageForTitle(title);
      if (!page) {
        console.warn(
          `Page not found for title: ${title} with tag #${PUBLIC_TAG}. This may be a broken link.`
        );

        return false;
      }

      return {
        path: `/${slugify(page.ZTITLE)}`,
        title: page.ZTITLE,
      };
    });

  const items = (await Promise.all(itemPromises)).filter(Boolean) as { path: string; title: string }[];

  const navItems = items.map(
    (item) => `<li><a href="${item.path}">${item.title}</a></li>`
  );

  navItems.unshift(`<li><a href="/">home</a></li>`);

  return `<ul>${navItems.join("\n")}</ul>`;
};
