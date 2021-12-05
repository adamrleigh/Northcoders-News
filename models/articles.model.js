const db = require('../db/connection');
const format = require('pg-format');
const { selectTopicById } = require('./topics.model');

const articleSelection = 'articles.*, COUNT(comments.comment_id) AS comment_count';

exports.selectArticles = async (req) => {

    if (req.query.topic) await selectTopicById(req);

    const selection = articleSelection + ',COUNT(DISTINCT articles.article_id) AS total_count'
    const query = format(`SELECT ${selection} FROM articles
    LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
    ${req.query.topic ? `WHERE articles.topic = $1` : ''}
    GROUP BY articles.article_id
    ORDER BY %I ${req.query.order || 'desc'}
    ${req.query.limit ? `LIMIT ${req.query.limit} OFFSET ${((req.query.p || 1) - 1) * req.query.limit}` : ''}
    ;`,
        req.query.sort_by || 'created_at');

    const { rows: articles } = req.query.topic
        ? await db.query(query, [req.query.topic])
        : await db.query(query);

    return articles;
}

exports.selectArticleById = async (req) => {
    const { rows: articles } = await db.query(`
    SELECT ${articleSelection} FROM articles
    LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    ;`,
        [req.params.article_id]
    );
    if (!articles[0]) throw { status: 404, message: 'error' }
    return articles[0];
}

exports.selectArticleComments = async (req) => {
    await this.selectArticleById(req);
    const { rows: comments } = await db.query(`
    SELECT comment_id, votes, created_at, author, body FROM comments 
    WHERE comments.article_id = $1
    ${req.query.limit ? `LIMIT ${req.query.limit} OFFSET ${((req.query.p || 1) - 1) * req.query.limit}` : ''}
    `,
        [req.params.article_id]
    )
    return comments;
}



exports.updateArticle = async (req) => {
    await this.selectArticleById(req);
    const { rows: articles } = await db.query(`
    UPDATE articles
    SET votes = votes ${req.body.inc_votes > 0 ? '+' : '- '} $1
    WHERE article_id = $2
    RETURNING *
    ;`,
        [req.body.inc_votes ? Math.abs(req.body.inc_votes) : 0, req.params.article_id]
    )
    return articles[0];
}




exports.addComment = async (req) => {
    await this.selectArticleById(req);
    const { rows: comments } = await db.query(
        format(`
    INSERT INTO comments 
    (%I, %I, %I)
    VALUES
    ($1, $2, $3)
    RETURNING *;`,
            ...Object.keys(req.body), 'article_id'),
        [...Object.values(req.body), req.params.article_id]
    );
    return comments[0];
}

exports.addArticle = async (req) => {
    const { rows: articles } = await db.query(
        format(`
    INSERT INTO articles 
    (%I, %I, %I, %I)
    VALUES
    ($1, $2, $3, $4)
    RETURNING article_id;`,
            ...Object.keys(req.body)),
        [...Object.values(req.body)]
    );
    return this.selectArticleById({ params: articles[0] });
}


exports.removeArticle = async (req) => {
    const { rows: articles } = await db.query(`SELECT article_id FROM articles WHERE article_id = $1`, [req.params.article_id]);
    if (!articles[0]) throw { status: 404, message: 'error' }
    db.query(`
    DELETE FROM articles WHERE article_id = $1;`,
        [req.params.article_id]
    );
}
