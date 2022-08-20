const PostRepository = require("../repositories/post.repository");

const postRepo = new PostRepository();

const createPost = async (postBody) => {
  return postRepo.create(postBody);
};

const queryPosts = async (filter, options) => {
  const result = await postRepo.getPosts(filter, options);
  return result;
};

// const getUserById = async (id) => {
//   const result = await userRepo.findById(id);
//   return result;
// };

// const updateUserById = async (userId, updateBody) => {
//   const user = await getUserById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, "User not found");
//   }
//   if (updateBody.email && (await userRepo.isEmailTaken(updateBody.email, updateBody))) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
//   }
//   const result = await userRepo.updateUserById(userId, updateBody);
//   return result;
// };

// const deleteUserById = async (userId) => {
//   const user = await getUserById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, "User not found");
//   }
//   const result = await userRepo.removeUserById(userId);
//   return result;
// };

module.exports = { createPost, queryPosts };
