const db = require('../db/connection');
const format = require('pg-format')


exports.selectTopics = async () => {
    const { rows } = await db.query(`
    SELECT * FROM topics
    `);
    return rows;
}

exports.selectTopicById = async (req) => {
    const { rows: topics } = await db.query(`
    SELECT * FROM topics
    WHERE slug = $1
    ;`,
        [req.params.slug]
    );
    if (!topics[0]) throw { status: 404, message: `topic with slug '${req.params.slug}' not found` }
    return topics[0];
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

exports.removeTopic = async (req) => {
    await this.selectTopicById(req);
    db.query(`
    DELETE FROM topics WHERE slug = $1;`,
        [req.params.slug]
    );
}