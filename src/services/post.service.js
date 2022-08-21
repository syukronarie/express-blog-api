const httpStatus = require("http-status");
const PostRepository = require("../repositories/post.repository");
const ApiError = require("../utils/ApiError");
const ErrorMessage = require("../utils/ErrorMessages");

const postRepo = new PostRepository();

const createPost = async (postBody) => {
  return postRepo.create(postBody);
};

const queryPosts = async (filter, options) => {
  const result = await postRepo.getPosts(filter, options);
  return result;
};

const getPostById = async (id) => {
  const result = await postRepo.findById(id);
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
