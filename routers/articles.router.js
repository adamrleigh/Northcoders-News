const articlesRouter = require('express').Router();
const { getArticles, postArticle, getArticleById, getArticleComments, patchArticle, postComment, deleteArticle } = require('../controllers/articles.controller');


articlesRouter
    .route('/')
    .get(getArticles)
    .post(postArticle);

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchArticle)
    .delete(deleteArticle);

articlesRouter
    .route('/:article_id/comments')
    .get(getArticleComments)
    .post(postComment);


module.exports = articlesRouter;