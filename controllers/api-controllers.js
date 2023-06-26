const { selectTopics } = require("../models/api-models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => next(err));
};

exports.getApi = (req, res) => {
  res.status(200).send({});
};
