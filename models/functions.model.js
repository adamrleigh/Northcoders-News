const format = require('pg-format');
const db = require('../db/connection');
const { badNum, getKeys, conditioner, patcher, poster } = require('./utils.model');


/*
newQuery creates a query, which is then passed to queryDatabase (or db.query in the case of DELETE requests)
which queries the database and handles the response:
- Empty response throws error (hence delete requests are handled directly by db.query)
- Singular items are returned as single array item 
- Arrays are returned as arrays

To generate the query, newQuery accepts many parameters and makes use of several helper functions
to format inputted data into an sql query (see utils.model.js)


Optional parameters are null by default and in this case an empty string is inserted where the parameter would be

Table and Method must always be specified
*/



const newQuery = (method, table, selection = '*', insert = null, conditions = [], joinType = null, joinWith = null, onKey = null, groupBy = null, sortBy = null, orderBy = null, limit = null, p = 1) => {
    const methods = { 'get': `SELECT ${selection} FROM`, 'patch': 'UPDATE', 'post': 'INSERT INTO', 'delete': 'DELETE FROM' }
    return format(`%s ${table}
    %s
    %s
    %s
    %s
    %s
    %s
    %s
    %s
    `,
        methods[method],
        method === 'patch' ? `SET ${patcher(insert)}` : '',
        method === 'post' ? `${poster(insert)}` : '',
        joinWith ? `${joinType} JOIN ${joinWith} ON ${table}.${onKey} = ${joinWith}.${onKey}` : '',
        conditions.length !== 0 ? `WHERE ${conditioner(conditions)}` : '',
        groupBy ? `GROUP BY ${groupBy}` : '',
        method === 'post' || method === 'patch' ? `RETURNING ${selection}` : '',
        sortBy ? `ORDER BY ${sortBy} ${orderBy}` : '',
        limit ? `LIMIT ${limit} OFFSET ${(p - 1) * limit}` : '',
    ).replace(/\s+/g, ' ').trim() + ';'
}

const getFrom = (table, values = '*', ...rest) =>
    queryDatabase(
        newQuery('get', table, values, null, ...rest)
    );

const patchTo = (table, values, ...rest) =>
    queryDatabase(
        newQuery('patch', table, '*', values, ...rest)
    );

const addTo = (table, values, selection = '*', ...rest) =>
    queryDatabase(
        newQuery('post', table, selection, values, [], ...rest)
    );


const queryDatabase = async (query) => {
    const { rows } = await db.query(query);
    if (rows.length === 0) throw { status: 400, message: `No results found` };
    return rows.length === 1
        ? rows[0]
        : rows;
}


const deleteFrom = (table, ...rest) =>
    db.query(
        newQuery('delete', table, null, null, ...rest)
    );

const incVote = (table, id, body, condition) => {
    if (/\D/.test(body.inc_votes)) throw { status: 400, message: 'inc_votes must be a number' };
    if (Object.keys(body).length > 1) throw { status: 400, message: 'supplied object should contain inc_votes only' }
    const values = [{ votes: `votes + ${body.inc_votes}` }]
    const newObj = {}
    newObj[condition] = id;
    return patchTo(table, values, [newObj])
}

module.exports = { getFrom, patchTo, incVote, deleteFrom, addTo };





//Graveyard

// const newQuery = (method, table, selection = '*', insert = null, conditions = [], joinType = null, joinWith = null, onKey = null, groupBy = null, sortBy = null, orderBy = null, limit = null, p = 1) => {
//     // if (conditions.length != 0 && badNum(condition)) throw { status: 400, message: `id must be a number` }
//     const methods = { 'get': `SELECT ${selection} FROM`, 'patch': 'UPDATE', 'post': 'INSERT INTO', 'delete': 'DELETE FROM' }
//     return format(`${methods[method]} ${table}
//     ${method === 'patch' ? `SET %s` : ''}
//     ${method === 'post' ? '%s' : ''}
//     ${joinWith ? `${joinType} JOIN ${joinWith} ON ${table}.${onKey} = ${joinWith}.${onKey}` : ''}
//     ${conditions.length !== 0 ? `WHERE ${conditioner(conditions)}` : ''}
//     ${groupBy ? `GROUP BY ${groupBy}` : ''}
//     ${method === 'post' || method === 'patch' ? `RETURNING ${selection}` : ''}
//     ${sortBy ? `ORDER BY ${sortBy} ${orderBy}` : ''}
//     ${limit ? `LIMIT ${limit} OFFSET ${(p - 1) * limit}` : ''}
//     `.replace(/\s+/g, ' ').trim() + ';',
//         method === 'get'
//             ? selection
//             : method === 'patch'
//                 ? patcher(insert)
//                 : method === 'post'
//                     ? poster(insert)
//                     : '',
//     )
// }


// const newSelectQuery = (table, values = '*', conditions = [], joinWith = null, onKey = null, groupBy = null, orderBy = null) => {
//     const q = newQuery('get', table = table, values = values, conditions = conditions, joinWith = joinWith, onKey = onKey, groupBy = groupBy, orderBy = orderBy);
//     return q;
// }

// const newPatchQuery = (table, values = '*', conditions = [], joinWith = null, onKey = null, groupBy = null, orderBy = null) => {
//     const q = newQuery('patch', table = table, values = values, conditions = conditions, null, null, null, null);
//     return q;
// }
