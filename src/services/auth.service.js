const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const ERR_MSG = require("../utils/ErrorMessages");
const tokenService = require("./token.service");
const userService = require("./user.service");

const loginUserWithEmail = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, ERR_MSG.EMAIL_IS_NOT_REGISTERED);
  }
  return user;
};

const refreshAuth = async (refreshtoken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyRefreshtoken(refreshtoken);
    const user = await userService.getUserById(refreshTokenDoc.id);
    if (!user) {
      throw new Error(ERR_MSG.NOT_FOUND);
    }
    const newToken = await tokenService.generateAuthToken(user);
    return { ...newToken, sub: user.id };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, ERR_MSG.REFRESH_AUTH_ERROR, true, error);
  }
};

module.exports = {
  loginUserWithEmail,
  refreshAuth,
};
