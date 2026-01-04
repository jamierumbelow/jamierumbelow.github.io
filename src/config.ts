import { homedir } from "os";
import { join } from "path";

export const VAULT_PATH = join(
  homedir(),
  "Documents",
  "Obsidian Vault",
  "jamierumbelow.net"
);

export const BOOKS_CSV_PATH = "./data/books.csv";
export const PUBLIC_TAG = "public";
export const PUBLIC_HOMEPAGE_TITLE = "jamierumbelow.net";
export const OUT_DIR = "docs";
