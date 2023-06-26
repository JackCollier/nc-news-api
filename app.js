const express = require("express");
const { getTopics } = require("./controllers/api-controllers");
const app = express();

app.get("/api/topics", getTopics);

app.use("/*", (err, req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send(err.msg);
  } else {
    next(err);
  }
});

module.exports = app;
