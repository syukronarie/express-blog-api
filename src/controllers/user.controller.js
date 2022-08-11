const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const userService = require("../services/user.service");
const logger = require("../config/logger");
const pick = require("../utils/pick");
const { sendResponseWithData } = require("../utils/responses");

const createUser = catchAsync(async (req, res) => {
  logger.info("Entering createUser function of user.controller");
  const user = await userService.createUser(req.body);
  logger.info("Exiting createUser function of user.controller");
  return sendResponseWithData(res, user, httpStatus.CREATED);
});

const getUsers = catchAsync(async (req, res) => {
  logger.info("Entering getUsers function of user.controller");
  const filter = pick(req.query, ["firstName", "lastName", "userName"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userService.queryUsers(filter, options);
  logger.info("Exiting getUsers function of user.controller");
  return sendResponseWithData(res, result);
});

module.exports = { createUser, getUsers };
