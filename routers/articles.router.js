const articlesRouter = require('express').Router();
const { getArticles, getArticleById, getArticleComments, patchArticle, postComment } = require('../controllers/articles.controller');


articlesRouter
    .route('/')
    .get(getArticles);

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchArticle);;

articlesRouter
    .route('/:article_id/comments')
    .get(getArticleComments)
    .post(postComment);


module.exports = articlesRouter;