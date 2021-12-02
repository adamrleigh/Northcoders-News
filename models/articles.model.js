const db = require('../db/connection');
const { getFrom, patchTo, incVote, addTo, deleteFrom, queryDatabase } = require('./functions.model');

const articleSelection = 'articles.*, COUNT(comments.comment_id) AS comment_count';
const articleArgs = ['LEFT OUTER', 'comments', 'article_id', 'articles.article_id'];

// exports.selectArticles = (req) => {
//     const conditions = req.params.article_id
//         ? [{ 'articles.article_id': req.params.article_id }]
//         : req.query.topic
//             ? [{ 'articles.topic': `'${req.query.topic}'` }]
//             : [];
//     return getFrom(
//         'articles',
//         articleSelection + ',COUNT(DISTINCT articles.article_id) AS total_count',
//         conditions,
//         ...articleArgs,
//         req.query.sort_by || 'created_at', req.query.order_by || 'desc',
//         req.query.limit || null, req.query.p || 1,
//     );
// }

exports.selectArticles = (req) => {
    const conditions = req.query.topic
        ? [{ 'articles.topic': `'${req.query.topic}'` }]
        : [];

    const selection = articleSelection + ',COUNT(DISTINCT articles.article_id) AS total_count'

    const [sortBy, orderBy, p] = [
        req.query.sort_by || 'created_at',
        req.query.order_by || 'desc',
        req.query.p || 1,
    ];

    const q = `SELECT ${selection} FROM articles
    LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
    ${conditions.length !== 0 ? `WHERE articles.topic = '${req.query.topic}'` : ''}
    GROUP BY articles.article_id
    ORDER BY ${sortBy} ${orderBy}
    ${req.query.limit ? `LIMIT ${req.query.limit} OFFSET ${(p - 1) * req.query.limit}` : ''}
    ;`

    return queryDatabase(q);
    // return queryDatabase(q,
    //     conditions
    //         ? [sortBy, req.query.topic]
    //         : [sortBy]
    // );
}

exports.selectArticleById = (req) => {
    const q = `
    SELECT ${articleSelection} FROM articles
    LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    ;`
    console.log(q);
    return queryDatabase(q, [req.params.article_id]);
}


// exports.selectArticles = (req) => {
//     const selection = articleSelection + `${req.id
//         ? ''
//         : ',COUNT(DISTINCT articles.article_id) AS total_count'}`
//     const [whereIdentifier, whereCondition] = req.params.article_id 

//     ? ['article_id', req.params.article_id]
//     : ['topic', req.]
//     return queryDatabase(
//         `SELECT ${selection} FROM articles 
//         ${whereCondition ? `WHERE req.`}`


//         'articles',
//         conditions,
//         ...articleArgs,
//         req.query.sort_by || 'created_at', req.query.order_by || 'desc',
//         req.query.limit || null, req.query.p || 1,
//     );
// }

// exports.selectArticleById = (req) => {
//     const selection = articleSelection + ',COUNT(DISTINCT articles.article_id) AS total_count'
// }

exports.selectArticleComments = (req) => {
    const q = `
    SELECT comment_id, votes, created_at, author, body FROM comments 
    WHERE comments.article_id = $1`;
    console.log(q);
    return queryDatabase(q, [req.params.article_id])
}


// exports.selectArticleComments = (req) =>
//     getFrom(
//         'comments',
//         'comment_id, votes, created_at, author, body',
//         [{ 'comments.article_id': req.params.article_id }]
//     );


exports.updateArticle = (req) =>
    incVote(
        'articles',
        req.params.article_id,
        req.body,
        'article_id'
    );


exports.addComment = (req) => {
    const q = `
    INSERT INTO comments 
    (author, body, article_id)
    VALUES
    (${Object.values(req.body).map(val => `'${val}'`)}, $1)
    RETURNING *;`;
    return queryDatabase(q, [req.params.article_id]);
}

// exports.addComment = (req) =>
//     addTo(
//         'comments',
//         { article_id: req.params.article_id, ...req.body }
//     );

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

exports.removeArticle = (req) => {
    const q = `
DELETE FROM articles WHERE article_id = $1`
    return queryDatabase(q, [req.params.article_id]);
}
// exports.removeArticle = (req) =>
//     deleteFrom(
//         'articles',
//         [{ article_id: req.params.article_id }]
//     );