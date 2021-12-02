const db = require('../db/connection');
const { queryDatabase, queryDatabaseById } = require('./functions.model');

exports.selectUsers = () =>
    queryDatabase(`
    SELECT username FROM users
    `);

exports.selectUserById = (req) =>
    queryDatabaseById(`
    SELECT * FROM users
    WHERE username = $1
    `,
        [req.params.user_id]
    );

