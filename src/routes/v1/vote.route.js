const express = require("express");
const validate = require("../../middlewares/validate");
const voteValidation = require("../../validations/vote.validation");
const voteController = require("../../controllers/vote.controller");
const JWT = require("../../middlewares/jwt");

const router = express.Router();
router.all("*", JWT.authenticateToken());
router
  .route("/")
  .post(validate(voteValidation.createVote), voteController.createVote)
  .get(validate(voteValidation.getVotesByPostId), voteController.getVotesByPostId);

router
  .route("/:voteId")
  .get(validate(voteValidation.getVote), voteController.getVote)
  .delete(validate(voteValidation.deleteVote), voteController.deleteVote);

module.exports = router;
