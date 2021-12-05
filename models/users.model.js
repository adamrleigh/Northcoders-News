const db = require('../db/connection');

exports.selectUsers = async () => {
    const { rows: users } = await db.query(`
    SELECT username FROM users
    `);
    return users;
}

exports.selectUserById = async (req) => {
    const { rows: users } = await db.query(`
    SELECT * FROM users
    WHERE username = $1
    ;`,
        [req.params.username]
    );
    if (!users[0]) throw { status: 404, message: `user with username '${req.params.username}' not found` }
    return users[0];
}

exports.selectUserComments = async (req) => {
    await this.selectUserById(req);
    const { rows: comments } = await db.query(`
    SELECT * FROM comments 
    WHERE author = $1
    ${req.query.limit ? `LIMIT ${req.query.limit} OFFSET ${((req.query.p || 1) - 1) * req.query.limit}` : ''}
    `,
        [req.params.username]
    )
    return comments;
}

