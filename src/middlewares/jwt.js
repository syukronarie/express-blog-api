const httpStatus = require("http-status");
const CONST = require("../models/constants");
const token = require("../services/token.service");
const ErrorMessage = require("../utils/ErrorMessages");
const { sendResponseWithData } = require("../utils/responses");

const authenticateToken = () => async (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader === null || authHeader === undefined)
    return sendResponseWithData(res, ErrorMessage.AUTH_ERROR, httpStatus.UNAUTHORIZED);
  const authResult = await token.verifyToken(req.headers.token);
  const { result, message, decoded } = authResult;
  if (result === CONST.SUCCESS) {
    req.decoded = decoded;
    return next();
  }
  return sendResponseWithData(res, message, httpStatus.FORBIDDEN);
};

module.exports = {
  authenticateToken,
};
