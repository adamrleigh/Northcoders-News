const { findErrors } = require("./errors.controller");

const doThis = (req, res, next, fun, code, key = null) => {
    findErrors(req);
    fun(req).then((result) => {
        if (key === null) res.status(code).send();
        else {
            const response = {};
            response[key] = result;
            res.status(code).send(response);
        }
    })
        .catch(next)
};

const getThis = (req, res, next, fun, key) =>
    doThis(req, res, next, fun, 200, key);


const postThis = (req, res, next, fun, key) =>
    doThis(req, res, next, fun, 201, key);


const deleteThis = (req, res, next, fun) =>
    doThis(req, res, next, fun, 204);


module.exports = { getThis, postThis, deleteThis };

