exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message });
    } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code = '22P02') res.status(400).send({ message: `Bad Request ${err}` })
    else next(err);
}

exports.handleServerErrors = (err, req, res, next) => {
    console.log(JSON.stringify(err));
    res.status(500).send({ message: `Internal Server Error` });
}