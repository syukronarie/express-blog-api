/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
const httpStatus = require("http-status");
const db = require("../config/db");
const CONST = require("../models/constants");
const ApiError = require("../utils/ApiError");
const generateRandomUUID = require("../utils/randomUUID");
const ERR_MSG = require("../utils/ErrorMessages");

function parseRawQueryToObject(data) {
  if (!data) return null;
  const { id, email, username, first_name, last_name, created_at, updated_at } = data;
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

function parseRawObjectToQuery(data, isUpdate = false) {
  if (!data) return null;
  const {
    id = generateRandomUUID(),
    email,
    password,
    userName,
    firstName,
    lastName,
    createdAt = new Date(),
    updatedAt = new Date(),
  } = data;
  if (isUpdate) {
    return {
      email,
      username: userName,
      password,
      first_name: firstName,
      last_name: lastName,
      updated_at: updatedAt,
    };
  }
  return {
    id,
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
  async create(userBody) {
    try {
      const data = parseRawObjectToQuery(userBody);
      const ids = await db(CONST.USERS_TABLE).insert(data, ["id"]);
      data.id = ids[0].id;
      delete data.password;
      return parseRawQueryToObject(data);
    } catch (err) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        ERR_MSG.INTERNAL_SERVER_ERROR,
        false,
        err
      );
    }
  }

  async isEmailTaken(email) {
    try {
      const res = await db(CONST.USERS_TABLE).where({ email }).first();
      return res;
    } catch (err) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        ERR_MSG.INTERNAL_SERVER_ERROR,
        true,
        err
      );
    }
  }

  async getUsers(filter, options) {
    const firstName = filter.firstName || null;
    const lastName = filter.lastName || null;
    const sortBy = filter.sortBy || null;
    const result = {};
    const limit = options.limit || 10;
    let page = options.page || 1;
    if (page < 1) page = 1;
    const offset = (page - 1) * limit;
    try {
      const query = db(CONST.USERS_TABLE).select("*").limit(limit).offset(offset);
      if (firstName) query.andWhereLike("first_name", `%${firstName}%`);
      if (lastName) query.andWhereLike("last_name", `%${lastName}%`);
      if (sortBy) query.orderBy("first_name", sortBy);
      let count = 0;
      const responses = await query.then((res) => res);
      if (!!firstName || !!lastName) {
        count = responses.length;
      } else {
        const data = await db(CONST.USERS_TABLE).count({ count: "*" }).first();
        count = data.count;
      }
      if (count > 0) {
        responses.forEach((val) => {
          delete val.password;
        });
      }
      result.total = Number(count);
      result.limit = limit;
      result.offset = offset;
      result.lastPage = Math.ceil(count / limit);
      result.currentPage = page;
      result.data = responses.map((values) => parseRawQueryToObject(values));
      return result;
    } catch (err) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        ERR_MSG.INTERNAL_SERVER_ERROR,
        true,
        err
      );
    }
  }

  async findById(id) {
    try {
      const res = await db(CONST.USERS_TABLE).where({ id }).first();
      return parseRawQueryToObject(res);
    } catch (err) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        ERR_MSG.INTERNAL_SERVER_ERROR,
        true,
        err
      );
    }
  }

  async findByEmail(email) {
    try {
      const res = await db(CONST.USERS_TABLE).where({ email }).first();
      return res;
    } catch (err) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        ERR_MSG.INTERNAL_SERVER_ERROR,
        true,
        err
      );
    }
  }

  async updateUserById(id, updateBody) {
    try {
      const data = parseRawObjectToQuery(updateBody, true);
      const ids = await db(CONST.USERS_TABLE).where({ id }).update(data, ["id"]);
      data.id = ids[0].id;
      return parseRawQueryToObject(data);
    } catch (err) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        ERR_MSG.INTERNAL_SERVER_ERROR,
        false,
        err
      );
    }
  }

  async removeUserById(id) {
    try {
      await db(CONST.USERS_TABLE).where({ id }).del();
      return { deleted: true };
    } catch (err) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        ERR_MSG.INTERNAL_SERVER_ERROR,
        false,
        err
      );
    }
  }
}

module.exports = UserRepository;
