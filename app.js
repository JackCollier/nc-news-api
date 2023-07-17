const express = require("express");
const apiRouter = require("./routes/api-router.js");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

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
