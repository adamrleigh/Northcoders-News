const db = require('../db/connection');
const { getFrom, patchTo, incVote, addTo, deleteFrom } = require('./functions.model');

const articleSelection = 'articles.*, COUNT(comments.comment_id) AS comment_count';
const articleArgs = ['LEFT OUTER', 'comments', 'article_id', 'articles.article_id'];

exports.selectArticles = (req) => {
    const conditions = req.params.article_id
        ? [{ 'articles.article_id': req.params.article_id }]
        : req.query.topic
            ? [{ 'articles.topic': `'${req.query.topic}'` }]
            : [];
    return getFrom(
        'articles',
        articleSelection + `${req.id ? '' : ',COUNT(DISTINCT articles.article_id) AS total_count'}`,
        conditions,
        ...articleArgs,
        req.query.sort_by || 'created_at', req.query.order_by || 'desc',
        req.query.limit || null, req.query.p || 1,
    );
}

exports.selectArticleComments = (req) =>
    getFrom(
        'comments',
        'comment_id, votes, created_at, author, body',
        [{ 'comments.article_id': req.params.article_id }]
    );


exports.updateArticle = (req) =>
    incVote(
        'articles',
        req.params.article_id,
        req.body,
        'article_id'
    );

exports.addComment = (req) =>
    addTo(
        'comments',
        { article_id: req.params.article_id, ...req.body }
    );

exports.addArticle = async (req) => {
    const { article_id } = await addTo(
        'articles',
        req.body,
        'article_id',
    );
    return getFrom(
        'articles',
        articleSelection,
        [{ 'articles.article_id': article_id }],
        ...articleArgs
    );
}

exports.removeArticle = (req) =>
    deleteFrom(
        'articles',
        [{ article_id: req.params.article_id }]
    );