import type { Page } from "./db";
import { slugify } from "./utils";

export const compilePageRefs = async (
  content: string,
  pages: Page[]
): Promise<string> => {
  const pageRefRegex = /\[\[([^\]]+)\]\]/g;
  const pageRefs = content.match(pageRefRegex);
  if (pageRefs) {
    for (const pageRef of pageRefs) {
      const pageTitle = pageRef.slice(2, -2);
      const page = pages.find((p) => p.ZTITLE === pageTitle);
      if (page) {
        const slug = slugify(page.ZTITLE);
        const link = `<a href="${slug}.html">${page.ZTITLE}</a>`;
        content = content.replaceAll(pageRef, link);
      } else {
        console.warn(`Page not found: ${pageTitle}`);
      }
    }
  }
  return content;
};
