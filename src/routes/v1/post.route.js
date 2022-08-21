const express = require("express");
const validate = require("../../middlewares/validate");
const postValidation = require("../../validations/post.validation");
const postController = require("../../controllers/post.controller");

const router = express.Router();

router
  .route("/")
  .post(validate(postValidation.createPost), postController.createPost)
  .get(validate(postValidation.getPosts), postController.getPosts);

router
  .route("/:postId")
  .get(validate(postValidation.getPost), postController.getPost)
  .patch(validate(postValidation.updatePost), postController.updatePost)
  .delete(validate(postValidation.deletePost), postController.deletePost);

module.exports = router;
