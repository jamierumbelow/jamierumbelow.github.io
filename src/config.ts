import { homedir } from "os";
import { join } from "path";

export const DB_PATH = join(
  homedir(),
  "Library",
  "Group Containers",
  "9K33E3U3T4.net.shinyfrog.bear",
  "Application Data",
  "database.sqlite"
);

export const PUBLIC_TAG = "PUBLIC/jamierumbelow.net";
export const PUBLIC_HOMEPAGE_TITLE = "jamierumbelow.net";

export const OUT_DIR = "docs";
