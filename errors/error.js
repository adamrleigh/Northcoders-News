exports.handleErrors = (err, req, res, next) => {
  if (err.status && err.message)
    res.status(err.status).send({ message: err.message });
  else if ((err.code = "22P02"))
    res.status(400).send({ message: `Bad Request ${err}` });
  else res.status(500).send({ message: `Internal Server Error` });
};
