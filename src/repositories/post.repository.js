/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
const httpStatus = require("http-status");

const db = require("../config/db");
const CONST = require("../models/constants");
const ApiError = require("../utils/ApiError");
const ERR_MSG = require("../utils/ErrorMessages");
const generateRandomUUID = require("../utils/randomUUID");

function parseRawQueryToObject(data) {
  if (!data) return null;
  const {
    id,
    author_id,
    categories,
    tags,
    title,
    content,
    banner_image,
    is_published,
    created_at,
    updated_at,
    published_at,
  } = data;
  return {
    id,
    authorId: author_id,
    bannerImage: banner_image,
    content,
    title,
    tags,
    categories,
    isPublished: is_published,
    publishedAt: published_at,
    updatedAt: updated_at,
    createdAt: created_at,
  };
}

function parseRawObjectToQuery(data, isUpdate = false) {
  if (!data) return null;
  const {
    id = generateRandomUUID(),
    authorId,
    bannerImage,
    content,
    title,
    tags,
    categories,
    isPublished = false,
    publishedAt,
    updatedAt = new Date(),
    createdAt = new Date(),
  } = data;
  if (isUpdate) {
    return {
      categories,
      tags,
      title,
      content,
      banner_image: bannerImage,
      is_published: isPublished,
      published_at: publishedAt,
      updated_at: updatedAt,
    };
  }
  return {
    id,
    author_id: authorId,
    categories,
    tags,
    title,
    content,
    banner_image: bannerImage,
    is_published: isPublished,
    published_at: publishedAt,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

class PostRepository {
  async create(postBody) {
    try {
      const data = parseRawObjectToQuery(postBody);
      console.log({ data });
      const ids = await db(CONST.POSTS_TABLE).insert(data, ["id"]);
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

  async getPosts(filter, options) {
    const title = filter.title || null;
    const content = filter.content || null;
    const sortBy = filter.sortBy || null;
    const result = {};
    const limit = options.limit || 10;
    let page = options.page || 1;
    if (page < 1) page = 1;
    const offset = (page - 1) * limit;
    try {
      const query = db(CONST.POSTS_TABLE).select("*").limit(limit).offset(offset);
      if (title) query.andWhereLike("title", `%${title}%`);
      if (content) query.andWhereLike("content", `%${content}%`);
      if (sortBy) query.orderBy("title", sortBy);
      let count = 0;
      const responses = await query.then((res) => res);
      if (!!title || !!content) {
        count = responses.length;
      } else {
        const data = await db(CONST.POSTS_TABLE).count({ count: "*" }).first();
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
      const res = await db(CONST.POSTS_TABLE).where({ id }).first();
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

  async updatePostById(id, updateBody) {
    try {
      const data = parseRawObjectToQuery(updateBody, true);
      const ids = await db(CONST.POSTS_TABLE).where({ id }).update(data, ["id"]);
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

  async removePostById(id) {
    try {
      await db(CONST.POSTS_TABLE).where({ id }).del();
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

module.exports = PostRepository;
