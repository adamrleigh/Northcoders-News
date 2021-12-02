const db = require('../db/connection');
const { queryDatabase, queryDatabaseById } = require('./functions.model');
const { validatePost } = require('../controllers/errors.controller')

exports.selectTopics = () =>
    queryDatabase(`
    SELECT * FROM topics
    `);

exports.addTopic = (req) => {
    validatePost(req, 'topics');
    return queryDatabaseById(`
    INSERT INTO topics 
    (description, slug)
    VALUES
    ($1, $2)
    RETURNING *;`,
        [...Object.values(req.body)]
    );
}
