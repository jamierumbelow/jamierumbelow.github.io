import { Database } from "bun:sqlite";
import { DB_PATH, PUBLIC_TAG } from "./config";

export const db = new Database(DB_PATH);

export const queryPagesForTag = ($tag: string) =>
  db
    .query<
      {
        Z_PK: string;
        ZTITLE: string;
        ZTEXT: string;
        ZMODIFICATIONDATE: number;
      },
      { $tag: string }
    >(
      `
    SELECT n.Z_PK, n.ZTITLE, n.ZTEXT, n.ZMODIFICATIONDATE
      FROM ZSFNOTE n
      JOIN Z_5TAGS tmap ON tmap.Z_5NOTES = n.Z_PK
      JOIN ZSFNOTETAG t ON t.Z_PK = tmap.Z_13TAGS
     WHERE t.ZTITLE = $tag
     `
    )
    .all({ $tag });

export const queryPageForTitle = ($title: string) =>
  db
    .query<
      {
        Z_PK: string;
        ZTITLE: string;
        ZTEXT: string;
        ZMODIFICATIONDATE: number;
      },
      { $title: string; $tag: string }
    >(
      `
    SELECT n.Z_PK, n.ZTITLE, n.ZTEXT, n.ZMODIFICATIONDATE
      FROM ZSFNOTE n
      JOIN Z_5TAGS tmap ON tmap.Z_5NOTES = n.Z_PK
      JOIN ZSFNOTETAG t ON t.Z_PK = tmap.Z_13TAGS
      WHERE t.ZTITLE = $tag AND n.ZTITLE = $title
      LIMIT 1
  `
    )
    .get({ $title, $tag: PUBLIC_TAG });
