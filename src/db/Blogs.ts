import { logger } from "../utils";
import { pool } from "./index";

export const Blogs = {
  /**
   * @desc check if the blog exists
   */

  exist: async function (
    title: string,
    link: string,
    organisationName: string,
    authorName: string,
    authorProfile: string
  ): Promise<boolean> {
    const text = `
        SELECT title, link, organisation_name, authors.name AS author_name, authors.profile AS author_profile
        FROM (
            SELECT title, link, organisations.name AS organisation_name, author 
            FROM blogs JOIN organisations ON organisation = organisations._id
        )
        AS blogs_org 
        JOIN authors ON author = authors._id
        WHERE title = $1
        AND link = $2
        AND organisation_name = $3
        AND authors.name = $4
        AND authors.profile = $5`;

    const values = [title, link, organisationName, authorName, authorProfile];

    logger("--- Blogs : DB call to check if the blog exists : START ---");

    const { rows } = await pool.query(text, values);

    logger("--- Blogs : DB call to check if the blog exists : END ---");

    return !!rows.length;
  },

  /**
   * @desc get blogs
   */

  get: async function (
    limit: number,
    offset: number,
    organisationName?: string
  ) {
    let text = "";

    if (organisationName) {
      text = `
        SELECT _id, title, link, organisation_name, authors.name AS author_name, authors.profile AS author_profile
        FROM (
          SELECT * FROM (
            SELECT title, link, organisations.name AS organisation_name, author 
            FROM blogs JOIN organisations ON organisation = organisations._id
          )
          AS blogs_org 
          WHERE organisation_name = $3
          LIMIT $1 OFFSET $2
        )
        AS filtered_blogs_org
        JOIN authors ON author = authors._id`;
    }

    if (!organisationName) {
      text = `
        SELECT _id, title, link, organisation_name, authors.name AS author_name, authors.profile AS author_profile
        FROM (
            SELECT title, link, organisations.name AS organisation_name, author 
            FROM (
              SELECT * FROM blogs LIMIT $1 OFFSET $2
            )
            AS sliced_blogs
            JOIN organisations ON organisation = organisations._id
        )
        AS blogs_org 
        JOIN authors ON author = authors._id`;
    }

    const values = [limit, offset, organisationName];

    logger("--- Blogs : DB call to get the blogs : START ---");

    const { rows } = await pool.query(text, values);

    logger("--- Blogs : DB call to get the blogs : END ---");

    return rows;
  },

  /**
   * @desc insert a new blog
   */

  insert: async function (
    title: string,
    link: string,
    organisationId: string,
    authorId: string
  ) {
    const text =
      "INSERT INTO blogs (title, link, organisation, author) VALUES ($1, $2, $3, $4)";
    const values = [title, link, organisationId, authorId];

    logger("--- Blogs : DB call to INSERT a new blog : START ---");

    await pool.query(text, values);

    logger("--- Blogs : DB call to INSERT a new blog : END ---");
  },
};
