const db = require('../db/connection');
const { getFrom, patchTo, incVote, addTo } = require('./functions.model');

const articleiser = (article_id) => {
    const values = 'articles.*, COUNT(comments.comment_id) AS comment_count'
    console.log(article_id, article_id === null);
    return getFrom('articles', values, article_id === null ? [] : [{ 'articles.article_id': article_id }], 'LEFT OUTER', 'comments', 'article_id', 'articles.article_id');
}

exports.selectArticles = () =>
    articleiser(null);

exports.selectArticleById = (article_id) =>
    articleiser(article_id);

exports.selectArticleComments = (article_id) => {
    const values = 'comment_id, votes, created_at, author, body';
    return getFrom('comments', values, [{ 'comments.article_id': article_id }]);
}

exports.updateArticle = (article_id, inc_votes) =>
    incVote(article_id, inc_votes, 'articles', 'article_id');

exports.addComment = (article_id, newComment) => {
    const values = { article_id: article_id, ...newComment };
    return addTo('comments', values);
};

