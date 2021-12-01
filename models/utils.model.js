
exports.badNum = num => /\D/.test(num) || num === NaN;

exports.getKeys = table => db.query(`SELECT * FROM ${table}`);


//From {k1: v1} to `k1 = v1`
const objectFlattener = ob =>
    Object.entries(ob).flat().join(' = ');


//From {k1: v1, k2: v2...} to `k1 = v1 AND k2 = v2...` when setting conditions
exports.conditioner = objectArr =>
    objectArr.map(objectFlattener).join(` AND `);


//From {k1: v1, k2: v2...} to `k1 = v1, k2 = v2...` when patching
exports.patcher = objectArr =>
    objectArr.map(objectFlattener).join(`, `);


//From {k1: v1, k2: v2...} to `(k1, k2...) VALUES (v1, v2...)` when posting
exports.poster = objectArr =>
    `(${Object.keys(objectArr).join(', ')}) 
VALUES (${Object.values(objectArr).map(val => typeof val === 'string' ? `'${val}'` : val).join(', ')})
`.replace(/\n/g, '');




// exports.checkInputs = asyn (method, table, values, conditions, joinType, joinWith, onKey, groupBy, sortBy, orderBy) => {
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
