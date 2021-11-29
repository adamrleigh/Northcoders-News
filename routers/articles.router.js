const articlesRouter = require('express').Router();
const { getArticles } = require('../controllers/articles.controller');


articlesRouter
    .route('/')
    .get(getArticles)

module.exports = articlesRouter;