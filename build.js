const fs = require("fs");
const { pages } = require("./config.json");
const csv = require("csv-parser");

// books
// -----------------------------------------------------------------------------

const CSV_PATH = "./data/books.csv";

const toBookLi = (row) => {
  const tags = row.tags.split(",");
  let html = `${row.title}`;

  // weird title formatting
  if (html.slice(-5) === ", The") {
    html = `The ${html.replace(", The", "")}`;
  }
  if (html.slice(-3) === ", A") {
    html = `A ${html.replace(", A", "")}`;
  }

  // mark good/great books
  // if (tags.includes("good")) {
  //   html = `<b>${html}</b>`;
  // } else if (tags.includes("great")) {
  //   html = `<b class="text-green-800 hover:text-white">${html}</b>`;
  // }

  // wrap in anchor
  html = `<a href="https://amazon.co.uk/dp/${row.upc_isbn10}" target="_blank">${html}</a>`;

  // author
  if (row.authors) {
    html += ` - ${row.authors}`;
  }

  return `<li class="pb-1">${html}</li>`;
};

const getBooksList = () => {
  const books = [];

  return new Promise((resolve) => {
    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on("data", (data) => books.push(data))
      .on("end", () => {
        resolve(
          `<ul id="books">${books.map(toBookLi).reverse().join("\n")}</ul>`
        );
      });
  });
};

// main
// -----------------------------------------------------------------------------

const nav = pages
  .map((page) => `<li><a href="/${page.path}">${page.title}</a></li>`)
  .join("\n");

const template = fs.readFileSync("./_template.html").toString();

const parse = (variables) =>
  Object.keys(variables).reduce(
    (str, name) => str.replace(`{{${name}}}`, variables[name]),
    template
  );

pages.forEach(async (page) => {
  try {
    const { title } = page;
    const content = fs.readFileSync(`./content/${page.content}.html`);
    const { mtime } = fs.statSync(`./content/${page.content}.html`);

    let modifiedTime = mtime;
    let booksList;
    if (page.content === "books") {
      booksList = await getBooksList();
      const { mtime } = fs.statSync(CSV_PATH);
      modifiedTime = mtime;
    }

    const templatedContent = parse({
      title,
      nav,
      content,
      booksList,
      updatedAt: `${modifiedTime.getDate()}/${modifiedTime.getMonth()}/${modifiedTime.getFullYear()}`,
    });

    fs.writeFileSync(
      `./docs/${page.path || page.content}.html`,
      templatedContent
    );

    console.log(`built /${page.path}`);
  } catch (e) {
    console.error(`failed building /${page.path}: ${e.message}`);
  }
});
