const db = require('../db/connection');

exports.checkTopicExists = async (topic_id) => {
    const { rows: slug } = await db.query(`SELECT slug FROM topics WHERE slug = $1`, [topic_id]);
    if (!slug[0]) throw { status: 404, message: 'error' }
};

const checkQueryExists = async (query, query_id, table) => {
    const { rows: queryResults } = await db.query(`SELECT ${query} FROM ${table} WHERE ${query} = $1`, [query_id]);
    if (!queryResults[0]) throw { status: 404, message: 'error' }
};


exports.checkArticleExists = article_id => checkQueryExists('article_id', article_id, 'articles');
exports.checkCommentExists = comment_id => checkQueryExists('comment_id', comment_id, 'comments');
exports.checkUserExists = username => checkQueryExists('username', username, 'users');



const queryDatabase = async (query, values) => {
    let body;
    if (values) body = await db.query(query, values);
    else body = await db.query(query)
    return body.rows;
}


module.exports = { queryDatabase };




