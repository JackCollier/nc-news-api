const { selectTopics, getApiEndpoints } = require("../models/api-models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => next(err));
};

exports.getApi = (req, res, next) => {
  getApiEndpoints()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => next(err));
};

exports.getArticleById = (req, res, next) => {
  res.status(200).send({});
};
