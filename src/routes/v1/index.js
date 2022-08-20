const express = require("express");
const userRoute = require("./user.route");
const postRoute = require("./post.route");
const authRoute = require("./auth.router");

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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
