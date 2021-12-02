const properties = {
    'articles': [
        'article_id',
        'title',
        'topic',
        'author',
        'body',
        'created_at',
        'votes'
    ],
    'comments': [
        'comment_id',
        'body',
        'votes',
        'author',
        'article_id',
        'created_at',
    ],
    'topics': [
        'topic_id',
        'description',
        'slug',
    ],
    'users': [
        'username',
        'name',
        'avatar_url',
    ]
}

const columnExists = (column) => {
    const stripped = column.replace(/.*\./, '');
    if (column === 'user_id' || stripped === 'user_id') return true;
    return Object.keys(properties).some(table => {
        return properties[table].includes(column)
            || properties[table].includes(stripped)
    });
}

const inValidPatch = (body) => {
    if (Object.keys(body).length !== 1 || Object.keys(body)[0] !== 'inc_votes') return { status: 400, message: 'Post must contain inc_votes only' }
    if (/\D/.test(body['inc_votes'])) return { status: 400, message: `inc_votes must be a number` }
}


exports.validatePost = (req, table) => {
    const props = Object.keys(req.body);
    props.forEach(prop => {
        if (!properties[table].includes(prop))
            throw { status: 400, message: `Invalid property ${prop} for table ${table}` };
        if (table === 'articles' && prop === 'article_id'
            || table === 'comments' && prop === 'comment_id'
            || table === 'topics' && prop === 'topic_id')
            throw { status: 400, message: `${prop} should not be included in the URL not body` }
        if (table === 'articles' && props.length !== 4
            || table === 'comments' && props.length !== 2
            || table === 'topics' && props.length !== 2)
            throw { status: 400, message: 'Not enough arguments supplied' }
    })
}





exports.findErrors = (req) => {
    const param = Object.keys(req.params)[0];
    if (req.body) {
        if (req.method === 'PATCH') if (inValidPatch(req.body)) throw inValidPatch(req.body)
    }
    if (param && !columnExists(param)) return { status: 400, message: `Column ${param} does not exist ${req.method} in ${JSON.stringify(properties)}` }
    if (![undefined, 'asc', 'desc'].includes(req.query.order_by)) throw { status: 400, message: `order_by must be either asc or desc not ${order_by}` }
    if (req.query.limit && /\D/.test(req.query.limit)) throw { status: 400, message: `Limit must be a number not ${limit}` }
    if (req.query.page && /\D/.test(page)) throw { status: 400, message: `Page must be a number not ${p}` }
    return false;
}