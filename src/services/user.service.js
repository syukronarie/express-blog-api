const httpStatus = require("http-status");
const logger = require("../config/logger");
const User = require("../models/user.model");
const UserRepository = require("../repositories/user.repository");
const ApiError = require("../utils/ApiError");

const createUser = async (userBody) => {
  const userRepo = new UserRepository();
  const { email, password, userName, firstName, lastName } = userBody;
  const user = new User({
    email,
    firstName,
    lastName,
    password,
    userName,
  });
  logger.info("Entering createUser function of user.service");
  if (await userRepo.isEmailTaken(email)) {
    logger.info(JSON.stringify({ BAD_REQUEST: httpStatus.BAD_REQUEST }));
    logger.info("Error: Exiting createUser function of user.service");
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  logger.info("Success: Exiting createUser function of user.service");
  return userRepo.create(user.parseRaw());
};

module.exports = { createUser };
