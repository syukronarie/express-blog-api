const express = require("express");
const validate = require("../../middlewares/validate");
const postValidation = require("../../validations/post.validation");
const postController = require("../../controllers/post.controller");
const JWT = require("../../middlewares/jwt");

const router = express.Router();
router
  .route("/")
  .post(JWT.authenticateToken(), validate(postValidation.createPost), postController.createPost)
  .get(JWT.decodedToken(), validate(postValidation.getPosts), postController.getPosts);
router
  .route("/:postId")
  .get(validate(postValidation.getPost), postController.getPost)
  .patch(JWT.authenticateToken(), validate(postValidation.updatePost), postController.updatePost)
  .delete(JWT.authenticateToken(), validate(postValidation.deletePost), postController.deletePost);

module.exports = router;
