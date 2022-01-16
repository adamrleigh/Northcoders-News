const homeRouter = require("express").Router();
const homePage = require("path");

homeRouter.route("/").get((req, res, next) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

module.exports = homeRouter;
