const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const logger = require("../config/logger");
const voteService = require("../services/vote.service");
const { sendResponseWithData } = require("../utils/responses");

const createVote = catchAsync(async (req, res) => {
  logger.info("Entering createVote function of vote.controller");
  const vote = await voteService.createVote(req.body);
  logger.info("Exiting createVote function of vote.controller");
  return sendResponseWithData(res, vote, httpStatus.CREATED);
});
const getVotes = catchAsync(async (_req, _res) => {});
const getVote = catchAsync(async (_req, _res) => {});
const updateVote = catchAsync(async (_req, _res) => {});
const deleteVote = catchAsync(async (_req, _res) => {});

module.exports = {
  createVote,
  getVotes,
  getVote,
  updateVote,
  deleteVote,
};
