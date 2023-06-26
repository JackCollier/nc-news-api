const db = require("../db/connection");
const fs = require("fs/promises");

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
  return db.query("SELECT * FROM articles;").then(({ rows }) => {
    return rows;
  });
};
