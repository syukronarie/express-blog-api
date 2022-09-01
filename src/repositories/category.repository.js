/* eslint-disable camelcase */
const httpStatus = require("http-status");
const db = require("../config/db");
const CONST = require("../models/constants");
const ApiError = require("../utils/ApiError");
const ErrorMessage = require("../utils/ErrorMessages");

const generateSlugByTitle = (title) => {
  if (!title) return null;
  return title.split(" ").join("-").toLowerCase();
};

const parseRawObjectToQuery = (data, isUpdate = false) => {
  if (!data) return null;
  const todayDate = new Date();
  const createdAt = todayDate;
  const updatedAt = todayDate;
  const publishedAt = null;

  const { title, description, slug = generateSlugByTitle(title), isPublished = false } = data;

  if (isUpdate)
    return {
      title,
      description,
      slug,
      is_published: isPublished,
      updated_at: updatedAt,
      published_at: isPublished ? todayDate : publishedAt,
    };

  return {
    title,
    description,
    slug,
    is_published: isPublished,
    created_at: createdAt,
    updated_at: updatedAt,
    published_at: isPublished ? todayDate : publishedAt,
  };
};

const parseRawQueryToObject = (data) => {
  if (!data) return null;
  const { id, title, description, slug, is_published, created_at, updated_at, published_at } = data;
  return {
    id,
    title,
    description,
    slug,
    isPublished: is_published,
    createdAt: created_at,
    updatedAt: updated_at,
    publishedAt: published_at,
  };
};

class CategoryRepo {
  async create(categoryBody) {
    const data = parseRawObjectToQuery(categoryBody);
    const ids = await db(CONST.POSTS_CATEGORIES_TABLE).insert(data, ["id"]);
    data.id = ids[0].id;
    return parseRawQueryToObject(data);
  }

  async findCategoryByTitle(title) {
    const res = await db(CONST.POSTS_CATEGORIES_TABLE).where({ title }).first();
    return parseRawQueryToObject(res);
  }

  async getCategories(filter, options) {
    const title = filter.title || null;
    const sortBy = filter.sortBy || null;
    const limit = options.limit || null;
    const result = {};
    let page = options.page || 1;
    if (page < 1) page = 1;
    const offset = limit ? (page - 1) * limit : null;
    try {
      const query = db(CONST.POSTS_CATEGORIES_TABLE).select("*");
      if (title) query.andWhereLike("title", `%${title}%`);
      if (sortBy) query.orderBy("title", sortBy);
      if (limit && offset) query.limit(limit).offset(offset);
      let count = 0;
      const responses = await query.then((res) => res);
      if (title) {
        count = responses.length;
      } else {
        const data = await db(CONST.POSTS_TABLE).count({ count: "*" }).first();
        count = Number(data.count);
      }
      result.total = count;
      result.limit = limit || count;
      result.offset = offset || 0;
      result.lastPage = Math.ceil(count / (limit || count));
      result.currentPage = page;
      result.data = responses.map((values) => parseRawQueryToObject(values));
      return result;
    } catch (err) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        ErrorMessage.INTERNAL_SERVER_ERROR,
        true,
        err
      );
    }
  }

  async findById(id) {
    try {
      const res = await db(CONST.POSTS_CATEGORIES_TABLE).where({ id }).first();
      return parseRawQueryToObject(res);
    } catch (err) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        ErrorMessage.INTERNAL_SERVER_ERROR,
        true,
        err
      );
    }
  }

  async updateCategoryById(id, updateBody) {
    try {
      const data = parseRawObjectToQuery(updateBody, true);
      const ids = await db(CONST.POSTS_CATEGORIES_TABLE).where({ id }).update(data, ["id"]);
      data.id = ids[0].id;
      return parseRawQueryToObject(data);
    } catch (err) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        ErrorMessage.INTERNAL_SERVER_ERROR,
        true,
        err
      );
    }
  }

  async removePostById(id) {
    try {
      await db(CONST.POSTS_CATEGORIES_TABLE).where({ id }).del();
      return { deleted: true };
    } catch (err) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        ErrorMessage.INTERNAL_SERVER_ERROR,
        true,
        err
      );
    }
  }
}

module.exports = CategoryRepo;
