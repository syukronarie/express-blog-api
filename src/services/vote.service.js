const httpStatus = require("http-status");
const { userService } = require(".");
const VoteRepository = require("../repositories/vote.repository");
const ApiError = require("../utils/ApiError");
const ErrorMessage = require("../utils/ErrorMessages");

const voteRepo = new VoteRepository();

const createVote = async (voteBody) => {
  return voteRepo.create(voteBody);
};

const getVoteById = async (id) => {
  const voteResult = await voteRepo.findById(id);
  await userService.getUserById(voteResult.authorId).then((res) => {
    const { userName, firstName, lastName } = res;
    Object.assign(voteResult, { authorDetails: { userName, firstName, lastName } });
  });
  return voteResult;
};

const getVotesByPostId = async (postId) => {
  const votesResult = await voteRepo.findByPostId(postId);
  const promises = [];
  if (votesResult.length > 0) {
    votesResult.forEach((val) => {
      const value = new Promise((resolve) => {
        userService.getUserById(val.authorId).then((res) => {
          const { userName, firstName, lastName } = res;
          Object.assign(val, { authorDetails: { userName, firstName, lastName } });
          resolve(val);
        });
      });
      promises.push(value);
    });
  }
  const result = await Promise.all(promises).then((res) => res);
  return result;
};

const deleteVoteById = async (voteId) => {
  const post = await getVoteById(voteId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND);
  }
  const result = await voteRepo.removePostById(voteId);
  return result;
};

module.exports = {
  createVote,
  getVoteById,
  getVotesByPostId,
  deleteVoteById,
};
