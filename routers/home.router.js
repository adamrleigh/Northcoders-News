const homeRouter = require("express").Router();

homeRouter.route("/").get((req, res, next) => {
  res.sendFile("../home.html");
});

module.exports = homeRouter;
