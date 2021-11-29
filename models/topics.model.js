const db = require('../db/connection');

exports.selectTopics = () => {
    return db.query(`
    SELECT * FROM TOPICS;
    `).then(({ rows }) => {
        return rows;
    })
}