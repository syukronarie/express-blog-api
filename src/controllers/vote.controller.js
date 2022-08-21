const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const logger = require("../config/logger");
const pick = require("../utils/pick");
const voteService = require("../services/vote.service");
const { sendResponseWithData } = require("../utils/responses");
const ApiError = require("../utils/ApiError");
const ErrorMessage = require("../utils/ErrorMessages");

const createVote = catchAsync(async (req, res) => {
  logger.info("Entering createVote function of vote.controller");
  const vote = await voteService.createVote(req.body);
  logger.info("Exiting createVote function of vote.controller");
  return sendResponseWithData(res, vote, httpStatus.CREATED);
});

const getVotesByPostId = catchAsync(async (req, res) => {
  logger.info("Entering getVotesByPostId function of post.controller");
  const filter = pick(req.query, ["postId"]);
  const result = await voteService.getVotesByPostId(filter.postId);
  logger.info("Exiting getVotesByPostId function of post.controller");
  return sendResponseWithData(res, result);
});

const getVote = catchAsync(async (req, res) => {
  logger.info("Entering getVote function of vote.controller");
  const vote = await voteService.getVoteById(req.params.voteId);
  if (!vote) {
    throw new ApiError(httpStatus.NOT_FOUND, ErrorMessage.NO_RECORDS_FOUND);
  }
  logger.info("Exiting getVote function of vote.controller");
  return sendResponseWithData(res, vote);
});

const deleteVote = catchAsync(async (req, res) => {
  logger.info("Entering deleteVote function of vote.controller");
  const vote = await voteService.deleteVoteById(req.params.voteId);
  if (!vote) {
    throw new ApiError(httpStatus.NOT_FOUND, ErrorMessage.NO_RECORDS_FOUND);
  }
  logger.info("Exiting deleteVote function of vote.controller");
  return sendResponseWithData(res, vote);
});

module.exports = {
  createVote,
  getVotesByPostId,
  getVote,
  deleteVote,
};
