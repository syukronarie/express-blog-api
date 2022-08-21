const catchAsync = require("../utils/catchAsync");

const createVote = catchAsync(async (_req, _res) => {});
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
