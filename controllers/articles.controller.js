const { selectArticles, selectArticleById, selectArticleComments, updateArticle, addComment } = require('../models/articles.model');
const { getThis, postThis } = require('./functions.controller')


exports.getArticles = (req, res, next) =>
    getThis(req, res, next, selectArticles, 'articles');


exports.getArticleById = (req, res, next) =>
    getThis(req, res, next, selectArticleById, 'article');


exports.getArticleComments = (req, res, next) =>
    getThis(req, res, next, selectArticleComments, 'comments');


exports.patchArticle = (req, res, next) =>
    getThis(req, res, next, updateArticle, 'article');

exports.postComment = (req, res, next) =>
    postThis(req, res, next, addComment, 'comment');
