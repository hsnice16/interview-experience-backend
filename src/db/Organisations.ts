import { pool } from "./index";
import { logger } from "../utils";
import { Organisation } from "../types";

export const Organisations = {
  /**
   * @desc find the organisation
   */

  find: async function (name: string): Promise<Organisation | undefined> {
    const text = "SELECT * FROM organisations WHERE LOWER(name) = LOWER($1)";
    const values = [name];

    logger("--- Organisations : DB call to find the organisation : START ---");

    const { rows } = await pool.query(text, values);

    logger("--- Organisations : DB call to find the organisation : END ---");

    return rows[0];
  },

  /**
   * @desc get organisations
   */

  get: async function (limit: number, offset: number): Promise<Organisation[]> {
    const text = "SELECT * FROM organisations LIMIT $1 OFFSET $2";
    const values = [limit, offset];

    logger("--- Organisations : DB call to get the organisations : START ---");

    const { rows } = await pool.query(text, values);

    logger("--- Organisations : DB call to get the organisations : END ---");

    return rows;
  },

  /**
   * @desc insert a new organisation
   */

  insert: async function (
    name: string,
    blogsCount: number
  ): Promise<{ _id: string }> {
    const text =
      "INSERT INTO organisations (name, blogsCount) VALUES ($1, $2) RETURNING _id";
    const values = [name, blogsCount];

    logger(
      "--- Organisations : DB call to INSERT a new organisation : START ---"
    );

    const { rows } = await pool.query(text, values);

    logger(
      "--- Organisations : DB call to INSERT a new organisation : END ---"
    );

    return rows[0];
  },

  /**
   * @desc update the organisation blogs count
   */

  update: async function (_id: string, blogsCount: number) {
    const text = "UPDATE organisations SET blogsCount = $1 WHERE _id = $2";
    const values = [blogsCount, _id];

    logger("-- Organisations : DB call to update the blogs count : START --");

    await pool.query(text, values);

    logger("-- Organisations : DB call to update the blogs count : END --");
  },
};
