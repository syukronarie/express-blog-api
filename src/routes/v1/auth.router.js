const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");
const authController = require("../../controllers/auth.controller");

const router = express.Router();

router.post("/login", validate(authValidation.login), authController.login);
router.post("/refresh-token", validate(authValidation.refreshToken), authController.refreshToken);

module.exports = router;
