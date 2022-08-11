const Joi = require("joi");
const { password } = require("./custom.validation");

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    userName: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    userName: Joi.string(),
    sortBy: Joi.string().default("asc").valid("asc", "desc"),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.number().integer().required(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.number().integer().required(),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      userName: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.number().integer().required(),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
