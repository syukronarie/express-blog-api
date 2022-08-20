const Joi = require("joi");

const createPost = {
  body: Joi.object().keys({
    authorId: Joi.string().required(),
    isPublished: Joi.boolean(),
    bannerImage: Joi.string(),
    content: Joi.string().required(),
    title: Joi.string().required(),
    tags: Joi.string(),
    categories: Joi.string(),
  }),
};

const getPosts = {
  query: Joi.object().keys({
    content: Joi.string(),
    title: Joi.string(),
    sortBy: Joi.string().default("asc").valid("asc", "desc"),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPost = {
  params: Joi.object().keys({
    postId: Joi.string().required(),
  }),
};

const updatePost = {
  params: Joi.object().keys({
    postId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      isPublished: Joi.boolean(),
      bannerImage: Joi.string(),
      content: Joi.string(),
      title: Joi.string(),
      tags: Joi.number(),
      categories: Joi.number(),
    })
    .min(1),
};

const deletePost = {
  params: Joi.object().keys({
    postId: Joi.string().required(),
  }),
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};
