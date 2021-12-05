const commentsRouter = require('express').Router();
const { getComments, getCommentById, patchComment, deleteComment, postComment } = require('../controllers/comments.controller');

commentsRouter
    .route('/')
    .get(getComments);


commentsRouter
    .route('/:comment_id')
    .get(getCommentById)
    .patch(patchComment)
    .delete(deleteComment);


module.exports = commentsRouter;