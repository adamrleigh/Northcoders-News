const db = require('../db/connection');


const badNum = num => /\D/.test(num) || num === NaN;



const getResult = result => result.length === 1
    ? result[0]
    : result;

//From {k1: v1} to `k1 = v1`
const objectFlattener = ob => Object.entries(ob).flat().join(' = ');


//From {k1: v1, k2: v2...} to `k1 = v1 AND k2 = v2...` when setting conditions
const conditioner = objectArr => objectArr.map(objectFlattener).join(` AND `);


//From {k1: v1, k2: v2...} to `k1 = v1, k2 = v2...` when patching
const patcher = objectArr => objectArr.map(objectFlattener).join(`, `);


//From {k1: v1, k2: v2...} to `(k1, k2...) VALUES (v1, v2...)` when posting
const poster = objectArr =>
    `(${Object.keys(objectArr).join(', ')}) 
VALUES (${Object.values(objectArr).join(', ')})
`.replace(/\n/g, '');


//Values are either:
// -GET: the columns to select in string format
// -Other methods: the values to insert into the table in object format

const newQuery = (method, table, values, conditions = [], joinWith = null, onKey = null, groupBy = null, orderBy = null) => {
    // if (conditions.length != 0 && badNum(condition)) throw { status: 400, message: `id must be a number` }
    const methods = { 'get': `SELECT ${values} FROM`, 'patch': 'UPDATE', 'post': 'INSERT INTO', 'delete': 'DELETE FROM' }
    return `${methods[method]} ${table}
    ${method === 'patch' ? `SET ${patcher(values)}` : ''}
    ${method === 'post' ? poster(values) : ''}
    ${joinWith ? `JOIN ${joinWith} ON ${table}.${onKey} = ${joinWith}.${onKey}` : ''}
    ${conditions.length !== 0 ? `WHERE ${conditioner(conditions)}` : ''}
    ${groupBy ? `GROUP BY ${groupBy}` : ''}
    ${method === 'post' || method === 'patch' ? 'RETURNING *' : ''}
    `.replace(/\s+/g, ' ').trim() + ';'
}

const getFrom = (table, values = '*', conditions = [], joinWith = null, onKey = null, groupBy = null, orderBy = null) =>
    queryDatabase(
        newQuery('get', table, values, conditions, joinWith, onKey, groupBy, orderBy)
    );


const patchTo = (table, values, conditions = []) =>
    queryDatabase(
        newQuery('patch', table, values, conditions)
    );

const addTo = (table, values) =>
    queryDatabase(
        newQuery('post', table, values)
    );


const queryDatabase = async (q) => {
    const { rows } = await db.query(q);
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