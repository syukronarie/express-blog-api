const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const logger = require("../config/logger");
const pick = require("../utils/pick");
const voteService = require("../services/vote.service");
const { sendResponseWithData } = require("../utils/responses");

const createVote = catchAsync(async (req, res) => {
  logger.info("Entering createVote function of vote.controller");
  const vote = await voteService.createVote(req.body);
  logger.info("Exiting createVote function of vote.controller");
  return sendResponseWithData(res, vote, httpStatus.CREATED);
});

const getVotesByPostId = catchAsync(async (req, res) => {
  logger.info("Entering getVotesByPostId function of post.controller");
  const filter = pick(req.query, ["postId"]);
  const result = await voteService.getVotesByPostId(filter);
  logger.info("Exiting getVotesByPostId function of post.controller");
  return sendResponseWithData(res, result);
});
const getVote = catchAsync(async (_req, _res) => {});
const updateVote = catchAsync(async (_req, _res) => {});
const deleteVote = catchAsync(async (_req, _res) => {});

module.exports = {
  createVote,
  getVotesByPostId,
  getVote,
  updateVote,
  deleteVote,
};
