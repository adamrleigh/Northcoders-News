const {
  selectArticles,
  selectArticleById,
  selectArticleComments,
  updateArticle,
  addComment,
  addArticle,
  removeArticle,
} = require("../models/articles.model");
const {
  getThis,
  postThis,
  deleteThis,
  patchThis,
} = require("./functions.controller");

exports.getArticles = (...controllerArgs) =>
  getThis(...controllerArgs, selectArticles, "articles");

exports.getArticleById = (...controllerArgs) =>
  getThis(...controllerArgs, selectArticleById, "article");

exports.getArticleComments = (...controllerArgs) =>
  getThis(...controllerArgs, selectArticleComments, "comments");

exports.patchArticle = (...controllerArgs) =>
  patchThis(...controllerArgs, updateArticle, "article");

exports.postComment = (...controllerArgs) =>
  postThis(...controllerArgs, addComment, "comment");

exports.postArticle = (...controllerArgs) =>
  postThis(...controllerArgs, addArticle, "article");

exports.deleteArticle = (...controllerArgs) =>
  deleteThis(...controllerArgs, removeArticle);
