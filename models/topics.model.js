const db = require('../db/connection');
const format = require('pg-format')

exports.selectTopics = async () => {
    const { rows } = await db.query(`
    SELECT * FROM topics
    `);
    return rows;
}

exports.addTopic = async (req) => {
    const { rows } = await db.query(
        format(`
    INSERT INTO topics 
    (%I, %I)
    VALUES
    ($1, $2)
    RETURNING *;`,
            ...Object.keys(req.body)),
        [...Object.values(req.body)]
    );
    return rows[0];
}
