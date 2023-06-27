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
      COALESCE(COUNT(comments.article_id), 0) AS comment_count
      FROM
      articles
      LEFT JOIN
      comments ON articles.article_id = comments.article_id
      GROUP BY
      articles.article_id
      ORDER BY
      articles.created_at DESC;
      `
    )
    .then(({ rows }) => rows);
};

exports.insertComment = (comment, article_id) => {
  const { username, body } = comment;
  console.log(comment);
  console.log(article_id);
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      console.log(rows);
      return rows[0];
    });
};
