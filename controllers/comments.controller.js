const {
  selectComments,
  selectCommentById,
  updateComment,
  removeComment,
} = require("../models/comments.model");
const { patchThis, deleteThis, getThis } = require("./functions.controller");

exports.getComments = (...controllerArgs) =>
  getThis(...controllerArgs, selectComments, "comments");

exports.getCommentById = (...controllerArgs) =>
  getThis(...controllerArgs, selectCommentById, "comment");

exports.patchComment = (...controllerArgs) =>
  patchThis(...controllerArgs, updateComment, "comment");

exports.deleteComment = (...controllerArgs) =>
  deleteThis(...controllerArgs, removeComment);
