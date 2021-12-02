const db = require('../db/connection');

const queryDatabase = async (query, values, returnObject = false) => {
    const { rows } = await db.query(query, values);
    if (rows.length === 0) throw { status: 400, message: `No results found` };
    return returnObject
        ? rows[0]
        : rows;
}

const queryDatabaseById = (query, values) => queryDatabase(query, values, true);

module.exports = { queryDatabase, queryDatabaseById };




