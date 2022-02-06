const express = require("express");
const apiRouter = require("./routers/api.router");
const homeRouter = require("./routers/home.router");
const { handleErrors } = require("./errors/error.js");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors());
app.use("/", homeRouter);
app.use("/api", apiRouter);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "route not found" });
});

app.use(handleErrors);

module.exports = app;
