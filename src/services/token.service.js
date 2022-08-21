/* eslint-disable operator-linebreak */
/* eslint-disable no-return-await */
const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const NodeCache = require("node-cache");
const config = require("../config/config");
const CONST = require("../models/constants");
const ApiError = require("../utils/ApiError");
const ERR_MSG = require("../utils/ErrorMessages");
const { encrypt, decrypt } = require("../middlewares/jose");
const { tokenTypes } = require("../config/tokens");

const myCache = new NodeCache();

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  const token = jwt.sign(payload, secret);
  return encrypt(token);
};

const generateAuthToken = async (user) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, "minutes");
  const accessToken = await generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, "days");
  const refreshToken = await generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
  myCache.set(user.id, refreshToken, 21600);
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const verifyToken = async (token) => {
  try {
    let result = CONST.SUCCESS;
    let message = "";
    const decrypted = await decrypt(token);
    const decoded = jwt.verify(decrypted, config.jwt.secret, (err, value) => {
      if (err) {
        result = CONST.FALSE;
        message = err.message;
      }
      return value;
    });
    return { result, message, decoded };
  } catch (err) {
    return new ApiError(httpStatus.UNAUTHORIZED, ERR_MSG.AUTH_ERROR, false, err);
  }
};

const verifyRefreshtoken = async (refreshToken) => {
  let result = {};
  const decrypted = await decrypt(refreshToken);
  jwt.verify(decrypted, config.jwt.secret, (err, decoded) => {
    if (err) {
      result = CONST.FALSE;
    }
    result = {
      id: decoded.sub,
    };
  });
  const getCacheToken = myCache.get(result.id);
  if (getCacheToken === undefined) {
    return CONST.FALSE;
  }
  if (getCacheToken === refreshToken) {
    return result;
  }
  return CONST.FALSE;
};

module.exports = {
  generateAuthToken,
  verifyToken,
  verifyRefreshtoken,
};
