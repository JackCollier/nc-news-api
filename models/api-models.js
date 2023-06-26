const db = require("../db/connection");
const fs = require("fs/promises");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.getApiEndpoints = () => {
  return fs.readFile("endpoints.json", "utf-8").then((data) => {
    return data;
  });
};
