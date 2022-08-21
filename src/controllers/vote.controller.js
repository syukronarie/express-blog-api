const catchAsync = require("../utils/catchAsync");

const createVote = catchAsync(async (req, res) => {});
const getVotes = catchAsync(async (req, res) => {});
const getVote = catchAsync(async (req, res) => {});
const updateVote = catchAsync(async (req, res) => {});
const deleteVote = catchAsync(async (req, res) => {});

module.exports = {
  createVote,
  getVotes,
  getVote,
  updateVote,
  deleteVote,
};
