const db = require("../db/connection");
const fs = require("fs/promises");
const { createRef } = require("../db/seeds/utils");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        const error = new Error("No article found with the specified ID");
        error.status = 404;
        error.msg = "Article not found";
        throw error;
      }
      return rows[0];
    });
};

exports.selectArticles = () => {
  return db
    .query(
      `
      SELECT 
      articles.article_id,
      articles.title,
      articles.created_at,
      articles.topic,
      articles.author,
      articles.article_img_url,
      COALESCE(comment_counts.comment_count, 0) AS comment_count
      FROM
      articles
      LEFT JOIN
      (
        SELECT
        article_id,
      COUNT(*) AS comment_count
      FROM
      comments
      GROUP BY
      article_id
      )
      AS comment_counts ON articles.article_id = comment_counts.article_id
      ORDER BY
      articles.created_at DESC;
      `
    )
    .then(({ rows }) => rows);
};

exports.selectCommentById = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        const error = new Error("No comments found with the specified ID");
        error.status = 404;
        error.msg = "Article not found";
        throw error;
      }
      return rows;
    });
};
