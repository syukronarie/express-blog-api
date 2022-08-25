const express = require("express");
const validate = require("../../middlewares/validate");
const categoryValidation = require("../../validations/category.validation");
const categoryController = require("../../controllers/category.controller");
const JWT = require("../../middlewares/jwt");

const router = express.Router();
router.all("*", JWT.authenticateToken());
router
  .route("/")
  .post(validate(categoryValidation.createCategory), categoryController.createCategory)
  .get(validate(categoryValidation.getCategorys), categoryController.getCategorys);
router
  .route("/:categoryId")
  .get(validate(categoryValidation.getCategory), categoryController.getCategory)
  .patch(validate(categoryValidation.updateCategory), categoryController.updateCategory)
  .delete(validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

module.exports = router;
