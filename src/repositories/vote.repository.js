/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
const httpStatus = require("http-status");

const db = require("../config/db");
const CONST = require("../models/constants");
const ApiError = require("../utils/ApiError");
const ERR_MSG = require("../utils/ErrorMessages");

function parseRawQueryToObject(data) {
  if (!data) return null;
  const { id, author_id, post_id } = data;
  return {
    id,
    authorId: author_id,
    postId: post_id,
  };
}

function parseRawObjectToQuery(data) {
  if (!data) return null;
  const { authorId, postId } = data;
  return {
    author_id: authorId,
    post_id: postId,
  };
}

class VoteRepository {
  async create(voteBody) {
    try {
      const data = parseRawObjectToQuery(voteBody);
      const ids = await db(CONST.POSTS_VOTES_TABLE).insert(data, ["id"]);
      data.id = ids[0].id;
      return parseRawQueryToObject(data);
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
      const res = await db(CONST.POSTS_VOTES_TABLE).where({ id }).first();
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

  async findByAuthorAndPostId(data) {
    try {
      const queryObj = parseRawObjectToQuery(data);
      const res = await db(CONST.POSTS_VOTES_TABLE).where(queryObj).first();
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

  async findByPostId(postId) {
    try {
      const res = await db(CONST.POSTS_VOTES_TABLE).where({ post_id: postId });
      return res.map(parseRawQueryToObject);
    } catch (err) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        ERR_MSG.INTERNAL_SERVER_ERROR,
        true,
        err
      );
    }
  }

  async removeVoteById(id) {
    try {
      await db(CONST.POSTS_VOTES_TABLE).where({ id }).del();
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

module.exports = VoteRepository;
