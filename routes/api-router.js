const express = require("express");
const router = express.Router();

const {
  getTopics,
  getApi,
  getArticleById,
  getArticles,
  postComment,
  postTopic,
  postArticle,
  getCommentsById,
  patchArticleById,
  patchCommentById,
  getUsers,
  deleteCommentById,
  deleteArticleById,
  getUserByUsername,
} = require("../controllers/api-controllers");

router.get("/topics", getTopics);
router.get("/", getApi);
router.get("/articles/:article_id", getArticleById);
router.get("/articles", getArticles);
router.post("/articles/:article_id/comments", postComment);
router.post("/topics", postTopic);
router.post("/articles", postArticle);
router.get("/articles/:article_id/comments", getCommentsById);
router.patch("/articles/:article_id", patchArticleById);
router.patch("/comments/:comment_id", patchCommentById);
router.get("/users", getUsers);
router.delete("/comments/:comment_id", deleteCommentById);
router.delete("/articles/:article_id", deleteArticleById);
router.get("/users/:username", getUserByUsername);

module.exports = router;
