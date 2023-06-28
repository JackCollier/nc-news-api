const { checkExists } = require("../db/seeds/utils");
const {
  selectTopics,
  getApiEndpoints,
  selectArticleById,
  selectArticles,
  selectCommentById,
} = require("../models/api-models");
const fs = require("fs/promises");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => next(err));
};

exports.getApi = (req, res, next) => {
  return fs
    .readFile("endpoints.json", "utf-8")
    .then((data) => {
      res.status(200).send(JSON.parse(data));
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

exports.getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  const promises = [
    selectCommentById(article_id),
    checkExists("articles", "article_id", article_id),
  ];
  Promise.all(promises)
    .then((responseArray) => {
      const comments = responseArray[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  res.status(200).send({});
};
