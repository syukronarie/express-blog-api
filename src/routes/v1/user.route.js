const express = require("express");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");
const JWT = require("../../middlewares/jwt");

const router = express.Router();
router
  .route("/")
  .post(validate(userValidation.createUser), userController.createUser)
  .get(JWT.authenticateToken(), validate(userValidation.getUsers), userController.getUsers);
router
  .route("/:userId")
  .get(validate(userValidation.getUser), userController.getUser)
  .patch(JWT.authenticateToken(), validate(userValidation.updateUser), userController.updateUser)
  .delete(JWT.authenticateToken(), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
