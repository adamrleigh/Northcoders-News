const db = require('../db/connection');
const { getFrom, patchTo, incVote, addTo, deleteFrom } = require('./functions.model');

const articleiser = (conditons = [], sortBy = null, orderBy = null) => {
    const values = 'articles.*, COUNT(comments.comment_id) AS comment_count'
    return getFrom('articles', values, conditons, 'LEFT OUTER', 'comments', 'article_id', 'articles.article_id', sortBy, orderBy);
}

exports.selectArticles = (id, body, queries) => {
    const conditions = queries.topic
        ? [{ 'articles.topic': `'${queries.topic}'` }]
        : [];
    let { sort_by, order_by } = queries;
    [sort_by, order_by] = [sort_by || null, order_by || null];
    return articleiser(conditions, sort_by, order_by);
}

exports.selectArticleById = (article_id) => {
    const conditions = [{ 'articles.article_id': article_id }];
    return articleiser(conditions);
};

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


//Need to add comment_count to this
exports.addArticle = (article_id, newArticle) => {
    return addTo('articles', newArticle);
};


exports.removeArticle = (article_id) =>
    deleteFrom('articles', [{ article_id: article_id }]);