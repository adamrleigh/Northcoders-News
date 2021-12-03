const properties = {
    'articles': [
        'title',
        'topic',
        'author',
        'body',
    ],
    'comments': [
        'body',
        'author',
    ],
    'topics': [
        'description',
        'slug',
    ],
    'users': [
        'username',
        'name',
        'avatar_url',
    ]
}


exports.validatePatch = (body) => {
    if (Object.keys(body).length !== 1 || Object.keys(body)[0] !== 'inc_votes') throw { status: 400, message: 'Post must contain inc_votes only' }
    if (/\D/.test(body['inc_votes'])) throw { status: 400, message: `inc_votes must be a number` }
}


exports.validatePost = (req, table) => {
    const props = Object.keys(req.body);
    if (props.length !== properties[table].length) throw { status: 400, message: `${table} expects ${properties[table].length} arguments\nReceived ${props.length} argument${props.length > 1 ? 's' : ''}` }
    props.forEach(prop => {
        if (!properties[table].includes(prop))
            throw { status: 400, message: `Invalid property ${prop} for table ${table}` };
    })
}


exports.validateReq = (req) => {
    const param = Object.keys(req.params)[0];
    if (req.method === 'PATCH') this.validatePatch(req.body)
    if (param) {
        if ((param === 'article_id'
            || param === 'comment_id'
            || param === 'topic_id') && /\D/.test(req.params[param]))
            throw { status: 400, message: `${param} must be a number` }
    }
    if (![undefined, 'asc', 'desc'].includes(req.query.order_by)) throw { status: 400, message: `order_by must be either asc or desc` }
    if (req.query.limit && /\D/.test(req.query.limit)) throw { status: 400, message: `Limit must be a number` }
    if (req.query.p && /\D/.test(req.query.p)) throw { status: 400, message: `Page must be a number` }
}