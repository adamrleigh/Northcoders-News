const { updateComment, removeComment } = require('../models/comments.model');
const { getThis, deleteThis } = require('./functions.controller');

exports.patchComment = (req, res, next) =>
    getThis(req, res, next, updateComment, 'comment');

exports.deleteComment = (req, res, next) =>
    deleteThis(req, res, next, removeComment);
