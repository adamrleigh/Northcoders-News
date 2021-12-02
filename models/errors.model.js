

const properties = {
    'articles': [
        'article_id', 'articles.article_id',
        'title', 'articles.title',
        'topic', 'articles.topic',
        'author', 'articles.author',
        'body', 'articles.body',
        'created_at', 'articles_created_at',
        'votes', 'articles.votes'
    ],
    'commments': [
        'comment_id', 'comments.comment_id',
        'body', 'comments.body',
        'votes', 'comments.votes',
        'author', 'comments.author',
        'article_id', 'comments.article_id',
        'created_at', 'comments.created_at'
    ],
    'topics': [
        'topic_id', 'topics.topic_id',
        'description', 'topics.description',
        'slug', 'topics.slug'
    ],
    'users': [
        'username', 'users.username',
        'name', 'users.name',
        'avatar_url', 'users.avatar_url'
    ]
}

const columnExists = (column) =>
    Object.keys(properties).some(table => properties[table].includes(column));

exports.findErrors = (req) => {
    if (req.params && !columnExists(r)
        || 
) return { status: 400, message: `Table ${table} does not contain column ${column}` }
    if (!['asc', 'desc'].includes(orderBy)) return { status: 400, message: `order_by must be either asc or desc not ${order_by}` }
    if (/\D/.test(limit)) return { status: 400, message: `Limit must be a number not ${limit}` }
    if (/\D/.test(page)) return { status: 400, message: `Page must be a number not ${p}` }
    return false;
}
