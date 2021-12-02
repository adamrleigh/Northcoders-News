const db = require('../db/connection');
const { queryDatabaseById } = require('./functions.model');

exports.updateComment = (req) =>
    queryDatabaseById(`
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *
    ;`,
        [req.body.inc_votes, req.params.comment_id]
    );


exports.removeComment = (req) =>
    db.query(`
    DELETE FROM comments WHERE comment_id = $1;`,
        [req.params.comment_id]
    );

