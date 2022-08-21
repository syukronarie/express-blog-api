const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const ErrorMessage = require("../utils/ErrorMessages");
const PostRepository = require("../repositories/post.repository");
const voteService = require("./vote.service");
const { tokenService } = require(".");

const postRepo = new PostRepository();

const createPost = async (postBody) => {
  return postRepo.create(postBody);
};

const queryPosts = async (token, filter, options) => {
  const postResults = await postRepo.getPosts(filter, options);
  const promises = [];
  if (postResults.data.length > 0) {
    const { decoded } = await tokenService.verifyToken(token);
    postResults.data.forEach((val) => {
      const value = new Promise((resolve) => {
        voteService.getVotesByPostId(val.id).then((res) => {
          let hasVoted = false;
          if (res.length > 0) {
            res.forEach((vote) => {
              if (decoded.sub === vote.authorId) hasVoted = true;
            });
          }
          Object.assign(val, { voteCount: res.length, hasVoted });
          resolve(val);
        });
      });
      promises.push(value);
    });
  }
  const result = await Promise.all(promises).then((res) => res);
  return result;
};

const getPostById = async (id) => {
  const result = await postRepo.findById(id);
  const votes = await voteService.getVotesByPostId(result.id);
  result.voteCount = votes.length;
  return result;
};

const updatePostById = async (postId, updateBody) => {
  const post = await getPostById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND);
  }
  const result = await postRepo.updatePostById(postId, updateBody);
  return result;
};

const deletePostById = async (postId) => {
  const post = await getPostById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND);
  }
  const result = await postRepo.removePostById(postId);
  return result;
};

module.exports = { createPost, queryPosts, getPostById, updatePostById, deletePostById };
