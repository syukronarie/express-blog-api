const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const postService = require("../services/post.service");
const logger = require("../config/logger");
const { sendResponseWithData } = require("../utils/responses");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const ERR_MSG = require("../utils/ErrorMessages");

const createPost = catchAsync(async (req, res) => {
  logger.info("Entering createPost function of post.controller");
  const post = await postService.createPost(req.body);
  logger.info("Exiting createPost function of post.controller");
  return sendResponseWithData(res, post, httpStatus.CREATED);
});

const getPosts = catchAsync(async (req, res) => {
  logger.info("Entering getPosts function of post.controller");
  const filter = pick(req.query, ["title", "content"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await postService.queryPosts(req.headers.token, filter, options);
  logger.info("Exiting getPosts function of post.controller");
  return sendResponseWithData(res, result);
});

const getPost = catchAsync(async (req, res) => {
  logger.info("Entering getPost function of post.controller");
  const post = await postService.getPostById(req.params.postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, ERR_MSG.NO_RECORDS_FOUND);
  }
  logger.info("Exiting getPost function of post.controller");
  return sendResponseWithData(res, post);
});

const updatePost = catchAsync(async (req, res) => {
  logger.info("Entering updatePost function of post.controller");
  const post = await postService.updatePostById(req.params.postId, req.body);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, ERR_MSG.NO_RECORDS_FOUND);
  }
  logger.info("Exiting updatePost function of post.controller");
  return sendResponseWithData(res, post);
});

const deletePost = catchAsync(async (req, res) => {
  logger.info("Entering deletePost function of post.controller");
  const post = await postService.deletePostById(req.params.postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, ERR_MSG.NO_RECORDS_FOUND);
  }
  logger.info("Exiting deletePost function of post.controller");
  return sendResponseWithData(res, post);
});
module.exports = { createPost, getPosts, getPost, updatePost, deletePost };
