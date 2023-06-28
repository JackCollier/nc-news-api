const express = require("express");
const {
  getTopics,
  getApi,
  getArticleById,
  getArticles,
  getCommentsById,
  patchArticleById,
} = require("./controllers/api-controllers");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.patch("/api/articles/:article_id", patchArticleById);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
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
