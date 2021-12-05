// const { queryDatabase } = require("../models/functions.model");

// const properties = {
//     'articles': [
//         'title',
//         'topic',
//         'author',
//         'body',
//     ],
//     'comments': [
//         'body',
//         'author',
//     ],
//     'topics': [
//         'description',
//         'slug',
//     ],
//     'users': [
//         'username',
//         'name',
//         'avatar_url',
//     ]
// }





// exports.validatePost = (req, table) => {
//     const props = Object.keys(req.body);
//     if (props.length !== properties[table].length) throw { status: 400, message: `${table} expects ${properties[table].length} arguments\nReceived ${props.length} argument${props.length > 1 ? 's' : ''}` }
//     props.forEach(prop => {
//         if (!properties[table].includes(prop))
//             throw { status: 400, message: `Invalid property ${prop} for table ${table}` };
//     })
// }

// // exports.checkExists = async (obj) => {
// //     const [property, value] = [Object.keys(obj)[0], Object.values(obj)[0]]
// //     const table = property.replace(/_id/, '') + 's';
// //     console.log(obj, property, value, table);
// //     queryDatabase(`
// //     SELECT ${property} AS prop FROM ${table} WHERE ${property === 'topic' ? 'slug' : `${property}`} = $1`,
// //         [value]
// //     ).then(({ rows }) => {
// //         if (rows.length === 0) throw { status: 404, message: `Entry with property ${property} value ${value} not found in table ${table}` };
// //     }).catch(next)
// // }



// exports.checkExists = async (obj, message) => {
//     const [property, value] = [Object.keys(obj[0]), Object.values(obj)[0]];
//     const table = property.replace(/_id/, '') + 's';
//     const { rows } = await db.query(`SELECT ${property} AS prop FROM ${table} WHERE ${property === 'topic' ? 'slug' : `${property}`} = $1`, [value]);
//     if (rows.length === 0) throw { status: 404, message: `Invalid ${message}` }
// }
