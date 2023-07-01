const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => rows);
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT a.*, (SELECT COUNT(*) FROM comments WHERE article_id = a.article_id) AS comment_count
       FROM articles a
       WHERE a.article_id = $1
       ORDER BY a.created_at ASC;
      `,
      [article_id]
    )
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

exports.selectArticles = (topic, sort_by = "created_at", order = "DESC") => {
  let query = `
      SELECT 
      articles.article_id,
      articles.title,
      articles.created_at,
      articles.topic,
      articles.author,
      articles.votes,
      articles.article_img_url,
      COALESCE(COUNT(comments.article_id), 0) AS comment_count
      FROM
      articles
      LEFT JOIN
      comments ON articles.article_id = comments.article_id
      `;

  const validSortBy = [
    "article_id",
    "title",
    "created_at",
    "topic",
    "author",
    "article_img_url",
    "votes",
    "comment_count",
  ];

  const validOrder = ["ASC", "DESC"];

  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const queryValues = [];

  if (topic) {
    query += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  if (sort_by) {
    query += ` GROUP BY
      articles.article_id`;
    query += ` ORDER BY ${sort_by} ${order}`;
  }

  return db.query(query, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.insertComment = (comment, article_id) => {
  const { username, body } = comment;
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
      [username, body, article_id]
    )
    .then(({ rows }) => rows[0]);
};

exports.insertTopic = (topic) => {
  const { slug, description } = topic;
  return db
    .query(
      `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;`,
      [slug, description]
    )
    .then(({ rows }) => rows[0]);
};

exports.insertArticle = (article) => {
  const { author, title, body, topic, article_img_url } = article;
  let query;
  let queryValues;
  if (article_img_url) {
    query = `INSERT INTO articles (title, topic, author, body, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
    queryValues = [title, topic, author, body, article_img_url];
  } else {
    query = `INSERT INTO articles (title, topic, author, body) VALUES ($1, $2, $3, $4) RETURNING *;`;
    queryValues = [title, topic, author, body];
  }
  return db.query(query, queryValues).then(({ rows }) => rows[0]);
};

exports.selectCommentById = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC`,
      [article_id]
    )
    .then(({ rows }) => rows);
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

exports.updateComment = (comment_id, body) => {
  const { inc_votes } = body;
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`,
      [inc_votes, comment_id]
    )
    .then(({ rows }) => rows[0]);
};

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => rows);
};

exports.deleteComment = (comment_id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id]);
};

exports.deleteArticle = (article_id) => {
  return db.query(`DELETE FROM articles WHERE article_id = $1;`, [article_id]);
};

exports.selectUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => rows[0]);
};
