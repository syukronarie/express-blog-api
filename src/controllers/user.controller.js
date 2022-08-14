const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const userService = require("../services/user.service");
const logger = require("../config/logger");
const pick = require("../utils/pick");
const { sendResponseWithData } = require("../utils/responses");
const ApiError = require("../utils/ApiError");

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

const getUser = catchAsync(async (req, res) => {
  logger.info("Entering getUser function of user.controller");
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  logger.info("Exiting getUser function of user.controller");
  return sendResponseWithData(res, user);
});

const updateUser = catchAsync(async (req, res) => {
  logger.info("Entering updateUser function of user.controller");
  const user = await userService.updateUserById(req.params.userId, req.body);
  logger.info("Exiting getUser function of user.controller");
  return sendResponseWithData(res, user);
});

const deleteUser = catchAsync(async (req, res) => {
  logger.info("Entering deleteUser function of user.controller");
  const result = await userService.deleteUserById(req.params.userId);
  logger.info("Exiting deleteUser function of user.controller");
  return sendResponseWithData(res, result);
});

module.exports = { createUser, getUsers, getUser, updateUser, deleteUser };
