const express = require("express");
const userRoute = require("./user.route");
const postRoute = require("./post.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/posts",
    route: postRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
