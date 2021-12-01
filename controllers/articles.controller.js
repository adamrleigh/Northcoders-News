const { selectArticles, selectArticleComments, updateArticle, addComment, addArticle, removeArticle } = require('../models/articles.model');
const { getThis, postThis, deleteThis } = require('./functions.controller')



exports.getArticles = (req, res, next) =>
    getThis(req, res, next, selectArticles, 'articles');

exports.getArticleById = (req, res, next) =>
    getThis(req, res, next, selectArticles, 'article');

exports.getArticleComments = (req, res, next) =>
    getThis(req, res, next, selectArticleComments, 'comments');

exports.patchArticle = (req, res, next) =>
    getThis(req, res, next, updateArticle, 'article');

exports.postComment = (req, res, next) =>
    postThis(req, res, next, addComment, 'comment');

exports.postArticle = (req, res, next) =>
    postThis(req, res, next, addArticle, 'article');

exports.deleteArticle = (req, res, next) =>
    deleteThis(req, res, next, removeArticle);