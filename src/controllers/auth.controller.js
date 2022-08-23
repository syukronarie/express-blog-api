const catchAsync = require("../utils/catchAsync");
const { authService, tokenService } = require("../services");
const { sendResponseWithData } = require("../utils/responses");
const logger = require("../config/logger");

const login = catchAsync(async (req, res) => {
  logger.info("Entering login function of auth.controller");
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
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
