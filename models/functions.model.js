const format = require('pg-format');
const db = require('../db/connection');
const { join } = require('../db/data/test-data/articles');


const badNum = num => /\D/.test(num) || num === NaN;

const getKeys = table => db.query(`SELECT * FROM ${table}`);

// const checkInputs = asyn (method, table, values, conditions, joinType, joinWith, onKey, groupBy, sortBy, orderBy) => {
//     return ['get', 'post', 'patch', 'delete'].includes(method)
//         && ['articles', 'comments', 'topics', 'users'].includes(table)
//         && values
//         && await getKeys(table).includes(conditions) || 
//         && [null, '', 'LEFT OUTER', 'RIGHT OUTER', 'LEFT INNER', 'RIGHT INNER', 'OUTER', 'INNER'].includes(joinType)
//         && ([null, 'articles', 'comments', 'topics', 'users'].includes(joinWith) && joinWith !== table)
//         && onKey
//         && groupBy
//         && sortBy
//         && [null, 'asc', 'desc'].includes(orderBy)
// }


const getResult = result => result.length === 1
    ? result[0]
    : result;

//From {k1: v1} to `k1 = v1`
const objectFlattener = ob =>
    Object.entries(ob).flat().join(' = ');


//From {k1: v1, k2: v2...} to `k1 = v1 AND k2 = v2...` when setting conditions
const conditioner = objectArr =>
    objectArr.map(objectFlattener).join(` AND `);


//From {k1: v1, k2: v2...} to `k1 = v1, k2 = v2...` when patching
const patcher = objectArr =>
    objectArr.map(objectFlattener).join(`, `);


//From {k1: v1, k2: v2...} to `(k1, k2...) VALUES (v1, v2...)` when posting
const poster = objectArr =>
    `(${Object.keys(objectArr).join(', ')}) 
VALUES (${Object.values(objectArr).join(', ')})
`.replace(/\n/g, '');

/*
newQuery creates a query, which is then passed to queryDatabase (or db.query in the case of DELETE requests)
which queries the database and handles the response:
- Empty response throws error (hence delete requests are handled directly by db.query)
- Singular items are returned as single array item 
- Arrays are returned as arrays
This is achieved by conditional logic, checking the size of the returned array

To generate the query, newQuery accepts many parameters and makes use of several helper functions
to format data for insertion appropriately.
Optional parameters are null by default and in this case an empty string is inserted where the parameter would be

Three parameters must always be specified: 
- Method
- Table
- Values

Values are either:
-GET: the columns to select in string format
-Other methods: the values to insert into the table (in object format, i.e. {article_id: 10})
*/

// const newQuery = (method, table, values, conditions = [], joinType = null, joinWith = null, onKey = null, groupBy = null, sortBy = null, orderBy = null) => {
//     // if (conditions.length != 0 && badNum(condition)) throw { status: 400, message: `id must be a number` }
//     const methods = { 'get': `SELECT ${values} FROM`, 'patch': 'UPDATE', 'post': 'INSERT INTO', 'delete': 'DELETE FROM' }
//     return `${methods[method]} ${table}
//     ${method === 'patch' ? `SET ${patcher(values)}` : ''}
//     ${method === 'post' ? poster(values) : ''}
//     ${joinWith ? `${joinType} JOIN ${joinWith} ON ${table}.${onKey} = ${joinWith}.${onKey}` : ''}
//     ${conditions.length !== 0 ? `WHERE ${conditioner(conditions)}` : ''}
//     ${groupBy ? `GROUP BY ${groupBy}` : ''}
//     ${method === 'post' || method === 'patch' ? 'RETURNING *' : ''}
//     `.replace(/\s+/g, ' ').trim() + ';'
// }



// const newQuery = (method, table, values, conditions = [], joinType = null, joinWith = null, onKey = null, groupBy = null, sortBy = null, orderBy = null) => {
//     // if (conditions.length != 0 && badNum(condition)) throw { status: 400, message: `id must be a number` }
//     const methods = { 'get': `SELECT ${values} FROM`, 'patch': 'UPDATE', 'post': 'INSERT INTO', 'delete': 'DELETE FROM' }
//     return `${methods[method]} ${table}
//     ${method === 'patch' ? `SET ${patcher(values)}` : ''}
//     ${method === 'post' ? poster(values) : ''}
//     ${joinWith ? `${joinType} JOIN ${joinWith} ON ${table}.${onKey} = ${joinWith}.${onKey}` : ''}
//     ${conditions.length !== 0 ? `WHERE ${conditioner(conditions)}` : ''}
//     ${groupBy ? `GROUP BY ${groupBy}` : ''}
//     ${method === 'post' || method === 'patch' ? 'RETURNING *' : ''}
//     `.replace(/\s+/g, ' ').trim() + ';'
// }

const newQuery = (method, table, values, conditions = [], joinType = null, joinWith = null, onKey = null, groupBy = null, sortBy = null, orderBy = null) => {
    // if (conditions.length != 0 && badNum(condition)) throw { status: 400, message: `id must be a number` }
    const methods = { 'get': `SELECT ${values} FROM`, 'patch': 'UPDATE', 'post': 'INSERT INTO', 'delete': 'DELETE FROM' }
    return format(`${methods[method]} ${table}
    ${method === 'patch' ? `SET %s` : ''}
    ${method === 'post' ? '%s' : ''}
    ${joinWith ? `${joinType} JOIN ${joinWith} ON ${table}.${onKey} = ${joinWith}.${onKey}` : ''}
    ${conditions.length !== 0 ? `WHERE ${conditioner(conditions)}` : ''}
    ${groupBy ? `GROUP BY ${groupBy}` : ''}
    ${method === 'post' || method === 'patch' ? 'RETURNING *' : ''}
    ${sortBy ? `ORDER BY ${sortBy} ${orderBy}` : ''}
    `.replace(/\s+/g, ' ').trim() + ';',
        method === 'get'
            ? values
            : method === 'patch'
                ? patcher(values)
                : method === 'post'
                    ? poster(values)
                    : '',
    )
}

/*
From newQuery, several higher order functions are generated:
- getFrom 
- patchTo 
- addTo
- deleteFrom 
*/


const getFrom = (table, values = '*', conditions = [], joinType = null, joinWith = null, onKey = null, groupBy = null, sortBy = null, orderBy = null) =>
    queryDatabase(
        newQuery('get', table, values, conditions, joinType, joinWith, onKey, groupBy, sortBy, orderBy)
    );


const patchTo = (table, values, conditions = []) =>
    queryDatabase(
        newQuery('patch', table, values, conditions)
    );

const addTo = (table, values) =>
    queryDatabase(
        newQuery('post', table, values)
    );


const queryDatabase = async (query) => {
    console.log(query)
    const { rows } = await db.query(query);
    if (rows.length === 0) throw { status: 400, message: `No results found` };
    return getResult(rows);
}


const deleteFrom = (table, conditions = []) =>
    db.query(
        newQuery('delete', table, null, conditions)
    );

const incVote = (id, inc, table, condition) => {
    const values = [{ votes: `votes + ${inc}` }]
    const newObj = {}
    newObj[condition] = id;
    return patchTo(table, values, [newObj])
}

const exists = (table, conditions) =>
    queryDatabase(
        newQuery('get', table, '*', conditions)
    );












// const newSelectQuery = (table, values = '*', conditions = [], joinWith = null, onKey = null, groupBy = null, orderBy = null) => {
//     const q = newQuery('get', table = table, values = values, conditions = conditions, joinWith = joinWith, onKey = onKey, groupBy = groupBy, orderBy = orderBy);
//     return q;
// }

// const newPatchQuery = (table, values = '*', conditions = [], joinWith = null, onKey = null, groupBy = null, orderBy = null) => {
//     const q = newQuery('patch', table = table, values = values, conditions = conditions, null, null, null, null);
//     return q;
// }


module.exports = { getFrom, patchTo, incVote, deleteFrom, addTo };