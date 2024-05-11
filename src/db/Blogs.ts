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
        WHERE LOWER(title) = LOWER($1)
        AND LOWER(link) = LOWER($2)
        AND LOWER(organisation_name) = LOWER($3)
        AND LOWER(authors.name) = LOWER($4)
        AND LOWER(authors.profile) = LOWER($5)`;

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
    organisationName?: string,
    searchKeywords?: string[]
  ) {
    let text = "";
    let values = [];

    if (organisationName || searchKeywords.length) {
      let whereClause = "";
      const searchKeywordsString = searchKeywords.reduce((acc, keyword) => {
        const query = `LOWER(title) LIKE LOWER('%${keyword}%')`;
        if (acc.length === 0) {
          return query;
        }

        return acc + ` OR ${query}`;
      }, "");

      if (organisationName && searchKeywords.length) {
        whereClause = `WHERE LOWER(organisation_name) = LOWER($3) AND (${searchKeywordsString})`;
        values = [limit, offset, organisationName];
      } else if (organisationName) {
        whereClause = `WHERE LOWER(organisation_name) = LOWER($3)`;
        values = [limit, offset, organisationName];
      } else if (searchKeywords.length) {
        whereClause = `WHERE ${searchKeywordsString}`;
        values = [limit, offset];
      }

      text = `
        SELECT _id, title, link, organisation_name, authors.name AS author_name, authors.profile AS author_profile
        FROM (
          SELECT * FROM (
            SELECT title, link, organisations.name AS organisation_name, author 
            FROM blogs JOIN organisations ON organisation = organisations._id
          )
          AS blogs_org 
          ${whereClause}
          LIMIT $1 OFFSET $2
        )
        AS filtered_blogs_org
        JOIN authors ON author = authors._id`;
    } else {
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

      values = [limit, offset];
    }

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
