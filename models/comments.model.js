const db = require('../db/connection');
const { incVote, deleteFrom } = require('./functions.model');

exports.updateComment = (req) =>
    incVote(
        'comments',
        req.params.comment_id,
        req.body,
        'comment_id'
    );

exports.removeComment = (req) =>
    deleteFrom(
        'comments',
        [{ comment_id: req.params.comment_id }]
    );

/*

modelFunc = (req) =>
    function(
        table,
        values,
        {
            where: [{ id: req.params.id }],
            join: table2
            joinType: 'left outer'
            onKey: 'keyName',
            groupBy: 'title',
            sortBy: 'title',
            orderBy: 'asc',
            limit: req.params.,
            page:
    }
    );


    */