/* eslint-disable no-unused-vars */
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const ErrorMessage = require("../utils/ErrorMessages");
const CategoryRepo = require("../repositories/category.repository");
const logger = require("../config/logger");

const categoryRepo = new CategoryRepo();

const createCategory = async (categoryBody) => {
  if (await categoryRepo.findCategoryByTitle(categoryBody.title)) {
    logger.info(JSON.stringify({ BAD_REQUEST: httpStatus.BAD_REQUEST }));
    throw new ApiError(httpStatus.BAD_REQUEST, ErrorMessage.CATEGORY_ALREADY_TAKEN);
  }
  return categoryRepo.create(categoryBody);
};

const queryCategories = async (filter, options) => {
  const result = await categoryRepo.getCategories(filter, options);
  return result;
};

const getCategoryById = async (id) => {};

const updateCategoryById = async (categoryId, updateBody) => {};

const deleteCategoryById = async (categoryId) => {};

module.exports = {
  createCategory,
  queryCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
