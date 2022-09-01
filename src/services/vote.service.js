/* eslint-disable no-param-reassign */
const httpStatus = require("http-status");
const { userService } = require(".");
const CONST = require("../models/constants");
const VoteRepository = require("../repositories/vote.repository");
const ApiError = require("../utils/ApiError");
const ErrorMessage = require("../utils/ErrorMessages");

const voteRepo = new VoteRepository();

const createVote = async (decoded, voteBody) => {
  const id = decoded.sub;
  const vote = await voteRepo.findByAuthorAndPostId(id, voteBody);
  if (vote) {
    throw new ApiError(httpStatus.BAD_REQUEST, ErrorMessage.YOU_HAVE_ALREADY_VOTED);
  }
  voteBody.authorId = id;
  return voteRepo.create(voteBody);
};

const updateVote = async (decoded, voteBody) => {
  const id = decoded.sub;
  const vote = await voteRepo.findByAuthorAndPostId(id, voteBody);
  const result = await voteRepo.removeVoteById(vote.id);
  return result;
};

const getVoteById = async (id) => {
  const voteResult = await voteRepo.findById(id);
  if (voteResult) {
    await userService.getUserById(voteResult.authorId).then((res) => {
      const { userName, firstName, lastName } = res;
      Object.assign(voteResult, { authorDetails: { userName, firstName, lastName } });
    });
  }
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
    const result = await Promise.all(promises).then((res) => res);
    return result;
  }
  return CONST.FALSE;
};

const deleteVoteById = async (voteId) => {
  const post = await getVoteById(voteId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND);
  }
  const result = await voteRepo.removeVoteById(voteId);
  return result;
};

module.exports = {
  createVote,
  updateVote,
  getVoteById,
  getVotesByPostId,
  deleteVoteById,
};
