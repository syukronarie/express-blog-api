const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const ERR_MSG = require("../utils/ErrorMessages");
const tokenService = require("./token.service");
const userService = require("./user.service");

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.password) === password) {
    throw new ApiError(httpStatus.UNAUTHORIZED, ERR_MSG.INCORRECT_EMAIL_OR_PASSWORD);
  }
  return user;
};

const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyRefreshtoken(refreshToken);
    const user = await userService.getUserById(refreshTokenDoc.id);
    if (!user) {
      throw new Error(ERR_MSG.NOT_FOUND);
    }
    return tokenService.generateAuthToken(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, ERR_MSG.AUTH_ERROR, true, error);
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  refreshAuth,
};
