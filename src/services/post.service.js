const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const ErrorMessage = require("../utils/ErrorMessages");
const PostRepository = require("../repositories/post.repository");
const voteService = require("./vote.service");
const CONST = require("../models/constants");

const postRepo = new PostRepository();

const createPost = async (postBody) => {
  return postRepo.create(postBody);
};

const queryPosts = async (decoded, filter, options) => {
  const postResults = await postRepo.getPosts(filter, options);
  const promises = [];
  if (postResults.data.length > 0) {
    postResults.data.forEach((val) => {
      const value = new Promise((resolve) => {
        voteService.getVotesByPostId(val.id).then((res) => {
          let hasVoted = false;
          let voteCount = 0;
          if (res !== CONST.FALSE) {
            if (res.length > 0 && decoded) {
              res.forEach((vote) => {
                if (decoded.sub === vote.authorId) hasVoted = true;
              });
            }
            voteCount = res.length;
          }
          Object.assign(val, { voteCount, hasVoted });
          resolve(val);
        });
      });
      promises.push(value);
    });
  }
  const result = await Promise.all(promises).then((res) => res);
  return result;
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
