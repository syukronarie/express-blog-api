// const httpStatus = require("http-status");
const VoteRepository = require("../repositories/vote.repository");
// const ApiError = require("../utils/ApiError");
// const ErrorMessage = require("../utils/ErrorMessages");

const voteRepo = new VoteRepository();

const createVote = async (voteBody) => {
  return voteRepo.create(voteBody);
};

module.exports = {
  createVote,
};
