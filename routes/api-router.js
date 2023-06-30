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

router.route("/topics").get(getTopics).post(postTopic);

router.route("/").get(getApi);

router
  .route("/articles/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById);

router.route("/articles").get(getArticles).post(postArticle);

router
  .route("/articles/:article_id/comments")
  .get(getCommentsById)
  .post(postComment);

router
  .route("/comments/:comment_id")
  .patch(patchCommentById)
  .delete(deleteCommentById);

router.route("/users").get(getUsers);

router.route("/users/:username").get(getUserByUsername);

module.exports = router;
