const commentsRouter = require('express').Router();
const { patchComment, deleteComment, addComment } = require('../controllers/comments.controller');

commentsRouter
    .route('/:comment_id')
    .patch(patchComment)
    .delete(deleteComment);


module.exports = commentsRouter;