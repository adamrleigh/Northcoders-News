const db = require('../db/connection');
const { incVote, deleteFrom } = require('./functions.model');

exports.updateComment = (req) =>
    incVote(
        'comments',
        req.params.comment_id,
        req.body.inc_votes,
        'comment_id'
    );

exports.removeComment = (req) =>
    deleteFrom(
        'comments',
        [{ comment_id: req.params.comment_id }]
    );