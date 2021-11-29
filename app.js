const express = require("express");
const apiRouter = require('./routers/api.router');
const { handleServerErrors,
    handlePsqlErrors,
    handleCustomErrors } = require("./errors/error.js");

const app = express();
app.use(express.json());
app.use('/api', apiRouter);

app.all("/*", (req, res) => {
    res.status(404).send({ message: "route not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;