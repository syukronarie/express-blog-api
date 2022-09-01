const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const { authService, tokenService } = require("../services");
const { sendResponseWithData } = require("../utils/responses");
const { encode } = require("../middlewares/base64");
const logger = require("../config/logger");
const ErrorMessage = require("../utils/ErrorMessages");
const ApiError = require("../utils/ApiError");

const login = catchAsync(async (req, res) => {
  logger.info("Entering login function of auth.controller");
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmail(email);
  const encryptedPass = encode(password);
  const result = await bcrypt.compareSync(encryptedPass, user.password);
  if (!result) {
    throw new ApiError(httpStatus.UNAUTHORIZED, ErrorMessage.INCORRECT_EMAIL_OR_PASSWORD);
  }
  const token = await tokenService.generateAuthToken(user);
  logger.info("Exiting login function of auth.controller");
  return sendResponseWithData(res, { ...token, sub: user.id });
});

const refreshToken = catchAsync(async (req, res) => {
  logger.info("Entering refreshToken function of auth.controller");
  const token = await authService.refreshAuth(req.headers.refreshtoken);
  logger.info("Exiting refreshToken function of auth.controller");
  return sendResponseWithData(res, token);
});

module.exports = {
  login,
  refreshToken,
};
