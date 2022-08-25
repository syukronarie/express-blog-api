const Joi = require("joi");

const createCategory = {
  body: Joi.object().keys({
    isPublished: Joi.boolean(),
    description: Joi.string(),
    title: Joi.string().required(),
  }),
};

const getCategories = {
  query: Joi.object().keys({
    title: Joi.string(),
    sortBy: Joi.string().default("asc").valid("asc", "desc"),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().required(),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      isPublished: Joi.boolean(),
      description: Joi.string(),
      title: Joi.string().required(),
    })
    .min(1),
};

const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().required(),
  }),
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
