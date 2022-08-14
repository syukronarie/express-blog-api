const httpStatus = require("http-status");
const logger = require("../config/logger");
const UserRepository = require("../repositories/user.repository");
const ApiError = require("../utils/ApiError");

const userRepo = new UserRepository();

const createUser = async (userBody) => {
  logger.info("Entering createUser function of user.service");
  if (await userRepo.isEmailTaken(userBody.email)) {
    logger.info(JSON.stringify({ BAD_REQUEST: httpStatus.BAD_REQUEST }));
    logger.info("Error: Exiting createUser function of user.service");
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  logger.info("Success: Exiting createUser function of user.service");
  return userRepo.create(userBody);
};

const queryUsers = async (filter, options) => {
  logger.info("Entering getUsers function of user.service");
  const result = userRepo.getUsers(filter, options);
  logger.info("Exiting getUsers function of user.service");
  return result;
};

const getUserById = async (id) => {
  logger.info("Entering getUserById function of user.service");
  const result = userRepo.findById(id);
  logger.info("Exiting getUserById function of user.service");
  return result;
};

module.exports = { createUser, queryUsers, getUserById };
