const db = require("../db/connection");
const fs = require("fs/promises");
const { checkExists } = require("../db/seeds/utils");
const format = require("pg-format");

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
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectCommentById = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.updateArticle = (article_id, body) => {
  const { inc_votes } = body;
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => rows[0]);
};

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

exports.deleteComment = (comment_id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id]);
};
