const token = require("../services/token.service");

const CONST = require("../models/constants");

const authenticateToken = () => async (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader === null || authHeader === undefined) return res.sendStatus(401);
  const authResult = await token.verifyToken(req.headers.token);
  const { result, decoded } = authResult;
  if (result === CONST.SUCCESS) {
    req.decoded = decoded;
    return next();
  }
  return res.status(403).send(authResult);
};

module.exports = {
  authenticateToken,
};
