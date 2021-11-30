const db = require('../db/connection');
const { incVote, deleteFrom } = require('./functions.model');

exports.updateComment = (comment_id, inc_votes) =>
    incVote(comment_id, inc_votes, 'comments', 'comment_id');

exports.removeComment = (comment_id) =>
    deleteFrom('comments', [{ comment_id: comment_id }]);