const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const categoryService = require("../services/category.service");
const logger = require("../config/logger");
const { sendResponseWithData } = require("../utils/responses");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const ERR_MSG = require("../utils/ErrorMessages");

const createCategory = catchAsync(async (req, res) => {
  logger.info("Entering createCategory function of category.controller");
  const category = await categoryService.createCategory(req.body);
  logger.info("Exiting createCategory function of category.controller");
  return sendResponseWithData(res, category, httpStatus.CREATED);
});

const getCategories = catchAsync(async (req, res) => {
  logger.info("Entering getCategories function of category.controller");
  const filter = pick(req.query, ["title"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await categoryService.queryCategories(filter, options);
  logger.info("Exiting getCategories function of category.controller");
  return sendResponseWithData(res, result);
});

const getCategory = catchAsync(async (req, res) => {
  logger.info("Entering getCategory function of category.controller");
  const category = await categoryService.getCategoryById(req.params.categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, ERR_MSG.NO_RECORDS_FOUND);
  }
  logger.info("Exiting getCategory function of category.controller");
  return sendResponseWithData(res, category);
});

const updateCategory = catchAsync(async (req, res) => {
  logger.info("Entering updateCategory function of category.controller");
  const category = await categoryService.updateCategoryById(req.params.categoryId, req.body);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, ERR_MSG.NO_RECORDS_FOUND);
  }
  logger.info("Exiting updateCategory function of category.controller");
  return sendResponseWithData(res, category);
});

const deleteCategory = catchAsync(async (req, res) => {
  logger.info("Entering deleteCategory function of category.controller");
  const category = await categoryService.deleteCategoryById(req.params.categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, ERR_MSG.NO_RECORDS_FOUND);
  }
  logger.info("Exiting deleteCategory function of category.controller");
  return sendResponseWithData(res, category);
});
module.exports = { createCategory, getCategories, getCategory, updateCategory, deleteCategory };
