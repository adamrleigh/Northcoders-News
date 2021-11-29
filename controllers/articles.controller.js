const { selectArticles, selectArticleById } = require('../models/articles.model');

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        res.status(200).send({ articles: articles })
    })
        .catch(next)
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
        res.status(200).send({ article: article })
    })
        .catch(next)
};