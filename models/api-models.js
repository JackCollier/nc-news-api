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
  let articles;
  return db
    .query("SELECT * FROM articles;")
    .then(({ rows }) => {
      articles = rows;
      return db.query(`
      SELECT article_id, COUNT(*) AS comment_count
      FROM comments
      GROUP BY article_id;
      `);
    })
    .then(({ rows }) => {
      const lookUp = createRef(rows, "article_id", "comment_count");
      const mappedArticle = articles.map((article) => {
        const articleCopy = { ...article };
        const commentCount = lookUp[articleCopy.article_id];
        if (commentCount === undefined) {
          articleCopy.comment_count = 0;
        } else {
          articleCopy.comment_count = +commentCount;
        }
        delete articleCopy.body;
        return articleCopy;
      });
      return mappedArticle.sort((a, b) => b.created_at - a.created_at);
    });
};
