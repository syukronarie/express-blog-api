const httpStatus = require("http-status");
const logger = require("../config/logger");
const UserRepository = require("../repositories/user.repository");
const ApiError = require("../utils/ApiError");
const ERR_MSG = require("../utils/ErrorMessages");

const userRepo = new UserRepository();

const createUser = async (userBody) => {
  if (await userRepo.isEmailTaken(userBody.email)) {
    logger.info(JSON.stringify({ BAD_REQUEST: httpStatus.BAD_REQUEST }));
    throw new ApiError(httpStatus.BAD_REQUEST, ERR_MSG.EMAIL_ALREADY_TAKEN);
  }
  return userRepo.create(userBody);
};

const queryUsers = async (filter, options) => {
  const result = await userRepo.getUsers(filter, options);
  return result;
};

const getUserById = async (id) => {
  const result = await userRepo.findById(id);
  return result;
};

const getUserByEmail = async (email) => {
  const result = await userRepo.findByEmail(email);
  return result;
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, ERR_MSG.USER_NOT_FOUND);
  }
  if (updateBody.email && (await userRepo.isEmailTaken(updateBody.email, updateBody))) {
    throw new ApiError(httpStatus.BAD_REQUEST, ERR_MSG.EMAIL_ALREADY_TAKEN);
  }
  const result = await userRepo.updateUserById(userId, updateBody);
  return result;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, ERR_MSG.USER_NOT_FOUND);
  }
  const result = await userRepo.removeUserById(userId);
  return result;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
