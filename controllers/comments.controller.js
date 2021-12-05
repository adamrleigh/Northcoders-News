const { selectComments, selectCommentById, updateComment, removeComment } = require('../models/comments.model');
const { patchThis, deleteThis, getThis } = require('./functions.controller');

exports.getComments = (req, res, next) =>
    getThis(req, res, next, selectComments, 'comments');

exports.getCommentById = (req, res, next) =>
    getThis(req, res, next, selectCommentById, 'comment');

exports.patchComment = (req, res, next) =>
    patchThis(req, res, next, updateComment, 'comment');

exports.deleteComment = (req, res, next) =>
    deleteThis(req, res, next, removeComment);
