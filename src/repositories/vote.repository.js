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
}

module.exports = VoteRepository;
