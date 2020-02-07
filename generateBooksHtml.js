/**
 * generate books html from csv
 */

const fs = require("fs");
const csv = require("csv-parser");

const CSV_PATH = "./data/books.csv";

const toHtml = row => {
  const tags = row.tags.split(",");
  let html = `${row.title}`;

  // mark good/great books
  if (tags.includes("good")) {
    html = `<b>${html}</b>`;
  } else if (tags.includes("great")) {
    html = `<b class="great">${html}</b>`;
  }

  // wrap in anchor
  html = `<a href="https://amazon.co.uk/dp/${row.isbn10}" target="_blank">${html}</a> - ${row.authors}`;

  // review?
  if (row.review) {
    html += row.review;
  }

  return `<li>${html}</li>`;
};

const books = [];

fs.createReadStream(CSV_PATH)
  .pipe(csv())
  .on("data", data => books.push(data))
  .on("end", () => {
    console.log('<ul id="books">');
    console.log(
      books
        .map(toHtml)
        .reverse()
        .join("\n")
    );
    console.log("</ul>");
  });
