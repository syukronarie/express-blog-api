const Joi = require("joi");

const createVote = {
  body: Joi.object().keys({
    authorId: Joi.string().required(),
    postId: Joi.string().required(),
  }),
};

const getVotesByPostId = {
  query: Joi.object().keys({
    postId: Joi.string().required(),
  }),
};

const getVote = {
  params: Joi.object().keys({
    voteId: Joi.string().required(),
  }),
};

const deleteVote = {
  params: Joi.object().keys({
    voteId: Joi.string().required(),
  }),
};

module.exports = {
  createVote,
  getVotesByPostId,
  getVote,
  deleteVote,
};
