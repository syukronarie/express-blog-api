/* eslint-disable no-param-reassign */
const httpStatus = require("http-status");
const db = require("../config/db");
const logger = require("../config/logger");
const CONST = require("../utils/Constants");
const ApiError = require("../utils/ApiError");

class UserRepository {
  async create(userBody) {
    console.log("userBody", userBody);
    const { email, password, userName, firstName, lastName } = userBody;
    try {
      logger.info("Entering create function of UserRepository");
      const ids = await db(CONST.USERS_TABLE).insert(
        {
          first_name: firstName,
          last_name: lastName,
          username: userName,
          password,
          email,
          created_at: new Date(),
        },
        ["id"]
      );
      userBody.id = ids[0].id;
      logger.info("Success: Exiting create function of UserRepository");
      return userBody;
    } catch (err) {
      logger.info("Error: Exiting create function of UserRepository");
      logger.error(err);
      throw new ApiError(httpStatus.BAD_REQUEST, "error");
    }
  }

  async isEmailTaken(email) {
    logger.info("Entering isEmailTaken function of UserRepository");
    try {
      const res = await db(CONST.USERS_TABLE).where({ email }).first();
      logger.info("Success: Exiting isEmailTaken function of UserRepository");
      return res;
    } catch (err) {
      logger.info("Error: Exiting isEmailTaken function of UserRepository");
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }
}

module.exports = UserRepository;
