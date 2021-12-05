const db = require('../db/connection');

exports.selectUsers = async () => {
    const { rows } = await db.query(`
    SELECT username FROM users
    `);
    return rows;
}

exports.selectUserById = async (req) => {
    const { rows: users } = await db.query(`SELECT username FROM users WHERE username = $1`, [req.params.username]);
    if (!users[0]) throw { status: 404, message: 'error' }
    const { rows } = await db.query(`
    SELECT * FROM users
    WHERE username = $1
    `,
        [req.params.username]
    );
    return rows[0];
}

