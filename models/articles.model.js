const db = require('../db/connection');

exports.selectArticles = () => {
    return db.query(`
    SELECT * FROM articles;
    `).then(({ rows }) => {
        return rows;
    })
};

exports.selectArticleById = article_id => {
    if (/\D/.test(article_id) || article_id === NaN) throw { status: 400, message: 'Article id must be a number' }
    return db.query(`
    SELECT * FROM articles WHERE article_id = $1;`,
        [article_id]
    ).then(({ rows }) => {
        if (!rows[0]) throw { status: 400, message: `Article with id ${article_id} not found` }
        return rows[0];
    })
};