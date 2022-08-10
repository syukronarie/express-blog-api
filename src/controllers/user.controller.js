const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const userService = require("../services/user.service");
const { sendResponseWithData } = require("../utils/responses");
const logger = require("../config/logger");

const createUser = catchAsync(async (req, res) => {
  logger.info("Entering createUser function of user.controller");
  const user = await userService.createUser(req.body);
  logger.info("Exiting createUser function of user.controller");
  return sendResponseWithData(res, user, httpStatus.CREATED);
});

module.exports = { createUser };
