/* eslint-disable no-param-reassign */
// const httpStatus = require("http-status");
const { userService } = require(".");
const VoteRepository = require("../repositories/vote.repository");
// const ApiError = require("../utils/ApiError");
// const ErrorMessage = require("../utils/ErrorMessages");

const voteRepo = new VoteRepository();

const createVote = async (voteBody) => {
  return voteRepo.create(voteBody);
};

const getVoteById = async (id) => {
  const result = await voteRepo.findById(id);
  return result;
};

const getVotesByPostId = async (postId) => {
  const votesResult = await voteRepo.findByPostId(postId);
  const promises = [];
  if (votesResult.length > 0) {
    votesResult.forEach((val) => {
      const value = new Promise((resolve) => {
        userService.getUserById(val.authorId).then((res) => {
          const { userName, firstName, lastName } = res;
          Object.assign(val, { userName, firstName, lastName });
          resolve(val);
        });
      });
      promises.push(value);
    });
  }
  const result = await Promise.all(promises).then((res) => res);
  return result;
};

module.exports = {
  createVote,
  getVoteById,
  getVotesByPostId,
};
