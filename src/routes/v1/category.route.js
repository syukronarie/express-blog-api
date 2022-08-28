const express = require("express");
const validate = require("../../middlewares/validate");
const validations = require("../../validations/category.validation");
const controllers = require("../../controllers/category.controller");
const JWT = require("../../middlewares/jwt");

const { authenticateToken } = JWT;

const router = express.Router();
router
  .route("/")
  .post(authenticateToken(), validate(validations.createCategory), controllers.createCategory)
  .get(validate(validations.getCategories), controllers.getCategories);
router
  .route("/:categoryId")
  .get(validate(validations.getCategory), controllers.getCategory)
  .patch(authenticateToken(), validate(validations.updateCategory), controllers.updateCategory)
  .delete(authenticateToken(), validate(validations.deleteCategory), controllers.deleteCategory);

module.exports = router;
