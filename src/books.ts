import fs from "fs";
import { BOOKS_CSV_PATH } from "./config";
import csv from "csv-parser";

const getBooksList = () =>
  new Promise((resolve) => {
    fs.createReadStream(BOOKS_CSV_PATH)
      .pipe(csv())
      .on("data", (data) => books.push(data))
      .on("end", () => {
        resolve(
          `<ul id="books">${books.map(toBookLi).reverse().join("\n")}</ul>`
        );
      });
  });

const books: any[] = [];

const toBookLi = (row: any) => {
  let html = `${row.title}`;

  // weird title formatting
  if (html.slice(-5) === ", The") {
    html = `The ${html.replace(", The", "")}`;
  }
  if (html.slice(-3) === ", A") {
    html = `A ${html.replace(", A", "")}`;
  }

  // wrap in anchor
  if (row.upc_isbn10) {
    html = `<a href="https://amazon.co.uk/dp/${row.upc_isbn10}" target="_blank">${html}</a>`;
  }

  // author
  if (row.first_name && row.last_name) {
    html += ` - ${row.first_name} ${row.last_name}`;
  }

  return `<li class="pb-1">${html}</li>`;
};

const getBooksHtml = async () => {
  if (!books.length) {
    await getBooksList();
  }
  return `<ul class="my-4">${books.map(toBookLi).reverse().join("\n")}</ul>`;
};

export const compileBooks = async (content: string) =>
  content.includes("{{books}}")
    ? content.replace("{{books}}", await getBooksHtml())
    : content;
