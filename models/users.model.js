const db = require('../db/connection');
const { getFrom } = require('./functions.model');

exports.selectUsers = () =>
    getFrom(
        'users',
        'username'
    );

exports.selectUserById = (req) =>
    getFrom(
        'users',
        'username, avatar_url, name',
        [{ username: `'${req.params.user_id}'` }]
    );
