/* eslint-disable no-param-reassign */
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const ErrorMessage = require("../utils/ErrorMessages");
const PostRepository = require("../repositories/post.repository");
const voteService = require("./vote.service");
const CONST = require("../models/constants");
const { userService } = require(".");

const postRepo = new PostRepository();

const createPost = async (postBody, decoded) => {
  const { sub } = decoded;
  postBody.authorId = sub;
  return postRepo.create(postBody);
};

const queryPosts = async (decoded, filter, options) => {
  const postResults = await postRepo.getPosts(filter, options);
  let promises = [];
  if (postResults.data.length > 0) {
    promises = postResults.data.map(async (val) => {
      const votes = await voteService.getVotesByPostId(val.id);
      let hasVoted = false;
      let voteCount = 0;
      if (votes !== CONST.FALSE) {
        if (votes.length > 0 && decoded) {
          votes.forEach((vote) => {
            if (decoded.sub === vote.authorId) hasVoted = true;
          });
        }
        voteCount = votes.length;
      }
      val.voteCount = voteCount;
      val.hasVoted = hasVoted;
      const author = await userService.getUserById(val.authorId);
      val.authorDetails = author;
      delete val.authorId;
      return val;
    });
  }
  promises = await Promise.all(promises).then((res) => res);
  return promises;
};

const getPostById = async (id, decoded) => {
  const result = await postRepo.findById(id);
  if (result) {
    await voteService.getVotesByPostId(result.id).then((res) => {
      let hasVoted = false;
      if (res !== CONST.FALSE) {
        if (res.length > 0 && decoded) {
          res.forEach((vote) => {
            if (decoded.sub === vote.authorId) hasVoted = true;
          });
        }
      }
      Object.assign(result, { voteCount: res.length, hasVoted });
    });
  }
  return result;
};

const updatePostById = async (postId, decoded, updateBody) => {
  const post = await getPostById(postId, decoded);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND);
  }
  if (decoded.sub !== post.authorId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, ErrorMessage.INVALID_TOKEN);
  }
  const result = await postRepo.updatePostById(postId, updateBody);
  return result;
};

const deletePostById = async (postId, decoded) => {
  const post = await getPostById(postId, decoded);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND);
  }
  if (decoded.sub !== post.authorId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, ErrorMessage.INVALID_TOKEN);
  }
  const result = await postRepo.removePostById(postId);
  return result;
};

module.exports = { createPost, queryPosts, getPostById, updatePostById, deletePostById };
