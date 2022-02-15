exports.validateQueries = async (req) => {
  if (req.query.limit && /\D/.test(req.query.limit))
    throw { status: 400, message: "limit must be a number" };
  if (req.query.p && /\D/.test(req.query.p))
    throw { status: 400, message: "p must be a number" };
  if (req.query.order && !["asc", "desc"].includes(req.query.order))
    throw { status: 400, message: "order must be either 'asc' or 'desc'" };
};
