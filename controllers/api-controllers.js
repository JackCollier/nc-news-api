const { checkExists } = require("../db/seeds/utils");
const {
  selectTopics,
  getApiEndpoints,
  selectArticleById,
  selectArticles,
  insertComment,
  selectCommentById,
  updateArticle,
  selectUsers,
  deleteComment,
  selectUserByUsername,
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
  const { topic, sort_by, order } = req.query;
  const promises = [selectArticles(topic, sort_by, order)];
  if (topic) {
    promises.push(checkExists("topics", "slug", topic));
  }
  Promise.all(promises)
    .then((responses) => {
      const articles = responses[0];
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  insertComment(req.body, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
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
  const promises = [
    updateArticle(article_id, req.body),
    checkExists("articles", "article_id", article_id),
  ];
  Promise.all(promises)
    .then((responseArray) => {
      const article = responseArray[0];
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const promises = [
    deleteComment(comment_id),
    checkExists("comments", "comment_id", comment_id),
  ];
  Promise.all(promises)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  const promises = [
    selectUserByUsername(username),
    checkExists("users", "username", username),
  ];
  Promise.all(promises)
    .then((responseArray) => {
      const user = responseArray[0];
      res.status(200).send({ user });
    })
    .catch(next);
};
