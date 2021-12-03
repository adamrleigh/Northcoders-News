const db = require('../db/connection');
const { queryDatabase, queryDatabaseById } = require('./functions.model');

exports.selectTopics = () =>
    queryDatabase(`
    SELECT * FROM topics
    `);

exports.addTopic = (req) =>
    queryDatabaseById(`
    INSERT INTO topics 
    (description, slug)
    VALUES
    ($1, $2)
    RETURNING *;`,
        [...Object.values(req.body)]
    );

