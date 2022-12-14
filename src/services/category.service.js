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

const getCategoryById = async (id) => {
  const result = await categoryRepo.findById(id);
  return result;
};

const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, ErrorMessage.NO_RECORDS_FOUND);
  }
  const result = await categoryRepo.updateCategoryById(categoryId, updateBody);
  return result;
};

const deleteCategoryById = async (categoryId) => {
  const post = await getCategoryById(categoryId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND);
  }
  const result = await categoryRepo.removePostById(categoryId);
  return result;
};

module.exports = {
  createCategory,
  queryCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
