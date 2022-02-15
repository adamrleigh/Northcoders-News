const { validateQueries } = require("./errors.controller");

const doThis = async (req, res, next, fun, code, key = null) => {
  try {
    await validateQueries(req);
    const result = await fun(req);
    key === null
      ? res.status(code).send()
      : res.status(code).send({ [key]: result });
  } catch (err) {
    next(err);
  }
};

exports.getThis = (req, res, next, fun, key) =>
  doThis(req, res, next, fun, 200, key);

exports.patchThis = (req, res, next, fun, key) =>
  doThis(req, res, next, fun, 200, key);

exports.postThis = (req, res, next, fun, key) =>
  doThis(req, res, next, fun, 201, key);

exports.deleteThis = (req, res, next, fun) => doThis(req, res, next, fun, 204);
