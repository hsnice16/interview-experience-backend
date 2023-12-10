import { pool } from "./index";
import { logger } from "../utils";

export const Authors = {
  /**
   * @desc find the author
   */

  find: async function (
    name: string,
    profile: string
  ): Promise<{ _id: string } | undefined> {
    const text =
      "SELECT _id FROM authors WHERE LOWER(name) = LOWER($1) AND LOWER(profile) = LOWER($2)";
    const values = [name, profile];

    logger("--- Authors : DB call to find the author : START ---");

    const { rows } = await pool.query(text, values);

    logger("--- Auhtors : DB call to find the author : END ---");

    return rows[0];
  },

  /**
   * @desc insert a new author
   */

  insert: async function (
    name: string,
    profile: string
  ): Promise<{ _id: string }> {
    const text =
      "INSERT INTO authors (name, profile) VALUES ($1, $2) RETURNING _id";
    const values = [name, profile];

    logger("--- Authors : DB call to INSERT a new author : START ---");

    const { rows } = await pool.query(text, values);

    logger("--- Authors : DB call to INSERT a new author : END ---");

    return rows[0];
  },
};
