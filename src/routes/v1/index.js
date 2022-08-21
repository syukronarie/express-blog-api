const express = require("express");
const userRoute = require("./user.route");
const postRoute = require("./post.route");
const authRoute = require("./auth.route");
const voteRoute = require("./vote.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/posts",
    route: postRoute,
  },
  {
    path: "/votes",
    route: voteRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
