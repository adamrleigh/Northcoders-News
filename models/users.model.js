const db = require('../db/connection');
const { getFrom } = require('./functions.model');

exports.selectUsers = () =>
    getFrom('users', 'username');

exports.selectUserById = (username) => {
    const values = 'username, avatar_url, name'
    return getFrom('users', values, [{ username: `'${username}'` }]);
}
