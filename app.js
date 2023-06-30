const express = require("express");
const {
  getTopics,
  getApi,
  getArticleById,
  getArticles,
  postComment,
  getCommentsById,
  patchArticleById,
  getUsers,
  deleteCommentById,
  getUserByUsername,
  patchCommentById,
  postTopic,
  postArticle,
  deleteArticleById,
} = require("./controllers/api-controllers");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.post("/api/articles/:article_id/comments", postComment);

app.post("/api/topics", postTopic);

app.post("/api/articles", postArticle);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.patch("/api/articles/:article_id", patchArticleById);

app.patch("/api/comments/:comment_id", patchCommentById);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.delete("/api/articles/:article_id", deleteArticleById);

app.get("/api/users/:username", getUserByUsername);

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.status && err.msg) {
    res.status(err.status).send(err.msg);
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
