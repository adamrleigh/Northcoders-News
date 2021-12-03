const db = require('../db/connection');
const format = require('pg-format');
const { queryDatabase, queryDatabaseById } = require('./functions.model');
const { validatePost } = require('../controllers/errors.controller')

const articleSelection = 'articles.*, COUNT(comments.comment_id) AS comment_count';


exports.selectArticles = (req) => {
    const selection = articleSelection + ',COUNT(DISTINCT articles.article_id) AS total_count'
    const [sortBy, orderBy, p] = [
        req.query.sort_by || 'created_at',
        req.query.order_by || 'desc',
        req.query.p || 1,
    ];

    const query = format(`SELECT ${selection} FROM articles
    LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
    ${req.query.topic ? `WHERE articles.topic = $1` : ''}
    GROUP BY articles.article_id
    ORDER BY %I ${orderBy}
    ${req.query.limit ? `LIMIT ${req.query.limit} OFFSET ${(p - 1) * req.query.limit}` : ''}
    ;`,
        sortBy);

    return req.query.topic
        ? queryDatabase(query, [req.query.topic])
        : queryDatabase(query);
}

exports.selectArticleById = (req) =>
    queryDatabaseById(`
    SELECT ${articleSelection} FROM articles
    LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    ;`,
        [req.params.article_id]
    );




exports.selectArticleComments = (req) => {
    const p = req.query.p || 1;
    return queryDatabase(`
    SELECT comment_id, votes, created_at, author, body FROM comments 
    WHERE comments.article_id = $1
    ${req.query.limit ? `LIMIT ${req.query.limit} OFFSET ${(p - 1) * req.query.limit}` : ''}
    `,
        [req.params.article_id]
    );
}




exports.updateArticle = (req) =>
    queryDatabaseById(`
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    ;`,
        [req.body.inc_votes, req.params.article_id]
    );




exports.addComment = (req) => {
    validatePost(req, 'comments');
    return queryDatabaseById(`
    INSERT INTO comments 
    (author, body, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *;`,
        [...Object.values(req.body), req.params.article_id]
    );
}


exports.addArticle = async (req) => {
    validatePost(req, 'articles');
    const { article_id } = await queryDatabaseById(`
    INSERT INTO articles 
    (title, topic, author, body)
    VALUES
    ($1, $2, $3, $4)
    RETURNING article_id;`,
        [...Object.values(req.body)]
    );
    return this.selectArticleById({ params: { article_id: article_id } });
}


exports.removeArticle = (req) => {
    return db.query(`
    DELETE FROM articles WHERE article_id = $1;`,
        [req.params.article_id]
    );
}
