/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
const httpStatus = require("http-status");
const db = require("../config/db");
const logger = require("../config/logger");
const CONST = require("../utils/Constants");
const ApiError = require("../utils/ApiError");
const User = require("../models/user.model");

function parseRawQueryToObject({
  id,
  email,
  username,
  first_name,
  last_name,
  created_at,
  updated_at,
}) {
  return {
    id,
    email,
    userName: username,
    firstName: first_name,
    lastName: last_name,
    createdAt: created_at,
    updatedAt: updated_at,
  };
}

function parseRawObjectToQuery({
  email,
  password,
  userName,
  firstName,
  lastName,
  createdAt = new Date(),
  updatedAt = new Date(),
}) {
  return {
    email,
    username: userName,
    password,
    first_name: firstName,
    last_name: lastName,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

class UserRepository {
  constructor() {
    this.user = new User();
  }

  async create(userBody) {
    try {
      logger.info("Entering create function of UserRepository");
      const data = parseRawObjectToQuery(userBody);
      const ids = await db(CONST.USERS_TABLE).insert(data, ["id"]);
      data.id = ids[0].id;
      delete data.password;
      logger.info("Success: Exiting create function of UserRepository");
      return parseRawQueryToObject(data);
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
      throw new ApiError(httpStatus.BAD_REQUEST, "Internal server error", true, err);
    }
  }

  async getUsers(filter, options) {
    logger.info("Entering getUsers function of UserRepository");
    const firstName = filter.firstName || null;
    const lastName = filter.lastName || null;
    const sortBy = filter.sortBy || null;
    const result = {};
    const limit = options.limit || 10;
    let page = options.page || 1;
    if (page < 1) page = 1;
    const offset = (page - 1) * limit;
    try {
      const { count } = await db(CONST.USERS_TABLE).count("*").first();
      const query = db(CONST.USERS_TABLE).select("*").limit(limit).offset(offset);
      if (firstName) query.andWhere("first_name", firstName);
      if (lastName) query.andWhere("last_name", lastName);
      if (sortBy) query.orderBy("first_name", sortBy);
      const responses = await query.then((res) => res);
      if (responses.length > 0)
        responses.forEach((val) => {
          delete val.password;
        });
      result.total = Number(count);
      result.limit = limit;
      result.offset = offset;
      result.lastPage = Math.ceil(count / limit);
      result.currentPage = page;
      result.data = responses.map((values) => parseRawQueryToObject(values));
      logger.info("Success: Exiting getUsers function of UserRepository");
      return result;
    } catch (err) {
      logger.info("Error: Exiting getUsers function of UserRepository");
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Internal server error", true, err);
    }
  }

  async findById(id) {
    logger.info("Entering findById function of UserRepository");
    try {
      const res = await db(CONST.USERS_TABLE).where({ id }).first();
      logger.info("Success: Exiting findById function of UserRepository");
      return parseRawQueryToObject(res);
    } catch (err) {
      logger.info("Error: Exiting findById function of UserRepository");
      throw new ApiError(httpStatus.BAD_REQUEST, "Internal server error", true, err);
    }
  }
}

module.exports = UserRepository;
