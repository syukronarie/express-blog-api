const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const postService = require("../services/post.service");
const logger = require("../config/logger");
// const pick = require("../utils/pick");
const { sendResponseWithData } = require("../utils/responses");
const pick = require("../utils/pick");
// const ApiError = require("../utils/ApiError");

const createPost = catchAsync(async (req, res) => {
  logger.info("Entering createPost function of user.controller");
  const post = await postService.createPost(req.body);
  logger.info("Exiting createPost function of user.controller");
  return sendResponseWithData(res, post, httpStatus.CREATED);
});

const getPosts = catchAsync(async (req, res) => {
  logger.info("Entering getPosts function of post.controller");
  const filter = pick(req.query, ["title", "content"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await postService.queryPosts(filter, options);
  logger.info("Exiting getPosts function of post.controller");
  return sendResponseWithData(res, result);
});

// const getPost = catchAsync(async (req, res) => {
//   logger.info("Entering getUser function of user.controller");
//   const post = await postService.getUserById(req.params.userId);
//   if (!post) {
//     throw new ApiError(httpStatus.NOT_FOUND, "User not found");
//   }
//   logger.info("Exiting getUser function of user.controller");
//   return sendResponseWithData(res, post);
// });

// const updatePost = catchAsync(async (req, res) => {
//   logger.info("Entering updateUser function of user.controller");
//   const post = await postService.updateUserById(req.params.userId, req.body);
//   logger.info("Exiting getUser function of user.controller");
//   return sendResponseWithData(res, post);
// });

// const deletePost = catchAsync(async (req, res) => {
//   logger.info("Entering deleteUser function of user.controller");
//   const result = await postService.deleteUserById(req.params.userId);
//   logger.info("Exiting deleteUser function of user.controller");
//   return sendResponseWithData(res, result);
// });

module.exports = { createPost, getPosts };
