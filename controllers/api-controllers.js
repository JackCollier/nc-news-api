const { selectTopics } = require("../models/api-models");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getApi = (req, res) => {
  res.status(200).send({});
};
