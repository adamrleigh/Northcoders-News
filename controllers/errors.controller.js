exports.validateQueries = async (req) => {
    if (req.query.limit && /\D/.test(req.query.limit)) return { message: 'limit must be a number' };
    if (req.query.p && /\D/.test(req.query.p)) return { message: 'p must be a number' };
    if (req.query.order && !['asc', 'desc'].includes(req.query.order)) return { message: "order must be either 'asc' or 'desc'" };
}
