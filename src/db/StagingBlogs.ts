import { StagingBlog } from "../types";
import { logger } from "../utils";
import { pool } from "./index";

export const StagingBlogs = {
  /**
   * @desc delete the blog
   */

  delete: async function (_id: string): Promise<StagingBlog> {
    const text = "DELETE FROM staging_blogs WHERE _id = $1 RETURNING *";
    const values = [_id];

    logger("-- StagingBlogs : DB call to delete the blog : START --");

    const { rows } = await pool.query(text, values);

    logger("-- StagingBlogs : DB call to delete the blog : END --");

    return rows[0];
  },

  /**
   * @desc check if the blog exists
   */

  exist: async function (_id: string): Promise<boolean> {
    const text = "SELECT _id FROM staging_blogs WHERE _id = $1";

    const values = [_id];

    logger(
      "--- StagingBlogs : DB call to check if the blog exists : START ---"
    );

    const { rows } = await pool.query(text, values);

    logger("--- StagingBlogs : DB call to check if the blog exists : END ---");

    return !!rows.length;
  },

  /**
   * @desc get staging blogs by their status
   */

  get: async function (status: string): Promise<StagingBlog[]> {
    const text = "SELECT * FROM staging_blogs WHERE status = $1";
    const values = [status];

    logger("--- StagingBlogs : DB call to get the staging blogs : START ---");

    const { rows } = await pool.query(text, values);

    logger("--- StagingBlogs : DB call to get the staging blogs : END ---");

    return rows;
  },

  /**
   * @desc insert a new staging blog
   */

  insert: async function (
    title: string,
    link: string,
    organisationName: string,
    authorName: string,
    authorProfile: string,
    status: string
  ): Promise<{ _id: string }> {
    const text = `
      INSERT INTO staging_blogs (title, link, organisation_name, author_name, author_profile, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING _id`;

    const values = [
      title,
      link,
      organisationName,
      authorName,
      authorProfile,
      status,
    ];

    logger("--- StagingBlogs : DB call to INSERT a new blog : START ---");

    const { rows } = await pool.query(text, values);

    logger("--- StagingBlogs : DB call to INSERT a new blog : END ---");

    return rows[0];
  },

  /**
   * @desc update the blog status
   */

  update: async function (_id: string, status: string): Promise<StagingBlog> {
    const text =
      "UPDATE staging_blogs SET status = $1 WHERE _id = $2 RETURNING *";

    const values = [status, _id];

    logger("-- StagingBlogs : DB call to update the blog status : START --");

    const { rows } = await pool.query(text, values);

    logger("-- StagingBlogs : DB call to update the blog status : END --");

    return rows[0];
  },
};
