
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
