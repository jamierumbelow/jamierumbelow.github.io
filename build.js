const fs = require("fs");
const { pages } = require("./config.json");

const nav = pages
  .map((page) => `<li><a href="/${page.path}">${page.title}</a></li>`)
  .join("\n");

const template = fs.readFileSync("./_template.html").toString();

const parse = (variables) =>
  Object.keys(variables).reduce(
    (str, name) => str.replace(`{{${name}}}`, variables[name]),
    template
  );

pages.forEach((page) => {
  try {
    const { title } = page;
    const content = fs.readFileSync(`./content/${page.content}.html`);
    const { mtime } = fs.statSync(`./content/${page.content}.html`);

    const templatedContent = parse({
      title,
      nav,
      content,
      updatedAt: `${mtime.getDate()}/${mtime.getMonth()}/${mtime.getFullYear()}`,
    });

    fs.writeFileSync(
      `./public/${page.path || page.content}.html`,
      templatedContent
    );

    console.log(`built /${page.path}`);
  } catch (e) {
    console.error(`failed building /${page.path}: ${e.message}`);
  }
});
