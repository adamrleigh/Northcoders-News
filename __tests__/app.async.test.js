const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');
const app = require('../app');
const endpoints = require('../endpoints.json');
require('jest-sorted');


beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api', () => {
    test('Response 200 and returns endpoints.json', async () => {
        const { text } = await request(app).get('/api')
            .expect(200);
        expect(JSON.parse(text)).toEqual(endpoints)
    })
})

describe('GET /api/topics', () => {
    test('Response 200 and returns object with key topics containing array of topics', async () => {
        const { body: { topics } } = await request(app)
            .get('/api/topics')
            .expect(200);
        expect(topics).toEqual([
            {
                "description": "The man, the Mitch, the legend",
                "slug": "mitch"
            },
            {
                "description": "Not dogs",
                "slug": "cats"
            },
            {
                "description": "what books are made of",
                "slug": "paper"
            }
        ])
    })
})

describe('POST /api/topics', () => {
    test('Response 201 and returns inserted topic if topic valid', async () => {
        const newTopic = {
            description: 'This is a new topic',
            slug: 'This is a new slug'
        }
        const { body: { topic } } = await request(app)
            .post('/api/topics')
            .send(newTopic)
            .expect(201)
        expect(topic).toEqual(
            {
                description: 'This is a new topic',
                slug: 'This is a new slug'
            }
        )
    })

    test('Response 400 if insufficient arguments', async () => {
        const newTopic = {
            description: 'This is a new topic',
        }
        const { body: { message } } = await request(app)
            .post('/api/topics')
            .send(newTopic)
            .expect(400)
        expect(message).toEqual('topics expects 2 arguments\nReceived 1 argument')

    })
    test('Response 400 if too many arguments', async () => {
        const newTopic = {
            description: 'This is a new topic',
            topic: 'This is a new topic',
            id: 1
        }
        const { body: { message } } = await request(app)
            .post('/api/topics')
            .send(newTopic)
            .expect(400)
        expect(message).toEqual('topics expects 2 arguments\nReceived 3 arguments')

    })
    test('Response 400 if invalid arguments', async () => {
        const newTopic = {
            description: 'This is a new topic',
            not_topic: 'This should be an error'
        }
        const { body: { message } } = await request(app)
            .post('/api/topics')
            .send(newTopic)
            .expect(400)
        expect(message).toEqual('Invalid property not_topic for table topics')

    })
})

describe('GET /api/articles', () => {
    test('Response 200 and returns object with key articles containing array of articles sorted by date_created desc', async () => {
        const { body: { articles } } = await request(app)
            .get('/api/articles')
            .expect(200);

        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy('created_at', { descending: true });
        articles.forEach(article => {
            expect(article).toEqual(expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(String)
            }))
        })
    })
    test('Is sorted by sort_by query', async () => {
        const { body: { articles } } = await request(app)
            .get('/api/articles?sort_by=title&&order_by=asc')
            .expect(200);

        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy('title');
        expect(articles).not.toBeSortedBy('author');
        articles.forEach(article => {
            expect(article).toEqual(expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(String)
            }))
        })
    })

    test('Ordered by order_by query', async () => {
        const { body: { articles } } = await request(app)
            .get('/api/articles?sort_by=author&&order_by=desc')
            .expect(200);

        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy('author', { descending: true });
        expect(articles).not.toBeSortedBy('title');
        articles.forEach(article => {
            expect(article).toEqual(expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(String)
            }))
        })
    })
    test('Filtered by topic', async () => {
        const { body: { articles } } = await request(app)
            .get('/api/articles?topic=cats')
            .expect(200);

        expect(articles).toEqual(
            [{
                title: 'UNCOVERED: catspiracy to bring down democracy',
                topic: 'cats',
                author: 'rogersop',
                body: 'Bastet walks amongst us, and the cats are taking arms!',
                created_at: expect.any(String),
                votes: 0,
                comment_count: "2",
                article_id: 5,
                total_count: "1"
            }]
        )
    })
    test('Results can be limited by limit query', async () => {
        const { body: { articles } } = await request(app)
            .get('/api/articles?limit=2')
            .expect(200)

        expect(articles).toHaveLength(2);

    })

    test('Pagination return correct page', async () => {
        const { body: { articles } } = await request(app)
            .get('/api/articles?sort_by=article_id&&order_by=asc&&limit=5&&p=2')
            .expect(200)

        expect(articles).toHaveLength(5);
        expect(articles.map(article => article.article_id)).toEqual([6, 7, 8, 9, 10])

    })

    test('Filtering by topic that does not exist returns error', () => {
        return request(app)
            .get('/api/articles?topic=lemur')
            .expect(400)
    })
})

describe('GET /api/articles/:article_id', () => {
    test('Response 200 and returns object with key article containing correct article if article exists', async () => {
        const { body: { article } } = await request(app)
            .get('/api/articles/1')
            .expect(200)

        expect(article).toEqual({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            body: 'I find this existence challenging',
            votes: 100,
            topic: 'mitch',
            author: 'butter_bridge',
            created_at: "2020-07-09T20:11:00.000Z",
            comment_count: "11",
        })
    })
    test('Response 400 and appropriate message if article_id is a number but article does not exist', async () => {
        const { body: { message } } = await request(app)
            .get('/api/articles/10000000')
            .expect(400)
        expect(message).toEqual('No results found')
    })

    test('Response 400 and appropriate message if article_id is not a number', async () => {
        const { body: { message } } = await request(app)
            .get('/api/articles/bad')
            .expect(400)

        expect(message).toEqual('article_id must be a number')
    })
})

describe('GET /api/articles/:article_id/comments', () => {
    test('Response 200 and returns array containing comment objects', async () => {
        const { body: { comments } } = await request(app)
            .get('/api/articles/1/comments')
            .expect(200);

        expect(comments).toHaveLength(11)
        comments.forEach(comment => {
            expect(comment).toEqual(expect.objectContaining({
                comment_id: expect.any(Number),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number)
            }))
        })
    })
})


describe('GET /api/users', () => {
    test('Response 200 and returns array containing user objects', async () => {
        const { body: { users } } = await request(app)
            .get('/api/users')
            .expect(200)
        expect(users).toHaveLength(4);
        expect(users).toEqual([
            { username: 'butter_bridge' },
            { username: 'icellusedkars' },
            { username: 'rogersop' },
            { username: 'lurker' }
        ])
    })
})


describe('PATCH /api/articles/:article_id', () => {
    test('Response 200 and returns updated article', async () => {
        newObj = { inc_votes: 100 }
        const { body: { article } } = await request(app)
            .patch('/api/articles/1')
            .send(newObj)
            .expect(200);

        expect(article).toEqual({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            body: 'I find this existence challenging',
            votes: 200,
            topic: 'mitch',
            author: 'butter_bridge',
            created_at: "2020-07-09T20:11:00.000Z",
        })
    })
})

describe('PATCH /api/comments/:article_id', () => {
    test('Response 200 and returns object with key comment containing comment object', async () => {
        newObj = { inc_votes: 100 }
        const { body: { comment } } = await request(app)
            .patch('/api/comments/1')
            .send(newObj)
            .expect(200);

        expect(comment).toEqual({
            article_id: 9,
            "body": "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            "comment_id": 1,
            "created_at": "2020-04-06T12:17:00.000Z",
            "votes": 116,
            author: 'butter_bridge'
        })
    })
})

describe('DELETE /api/comments/:article_id', () => {
    test('Response 204', () => {
        return request(app)
            .delete('/api/comments/1')
            .expect(204)
    })
})


describe('GET /api/users/:username', () => {
    test('Response 200 and returns object with key user containing user', async () => {
        const { body: { user } } = await request(app)
            .get('/api/users/lurker')
            .expect(200)

        expect(user).toEqual({
            "avatar_url": "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            "name": "do_nothing",
            "username": "lurker",
        })
    })
})


describe('POST /api/articles/:article_id/comments', () => {
    test('Response 201 and returns newly inserted comment in an object with key of comment', async () => {
        const newComment = {
            author: `lurker`,
            body: `Yes, good`
        }
        const { body: { comment } } = await request(app)
            .post('/api/articles/2/comments')
            .send(newComment)
            .expect(201);

        expect(comment).toEqual({
            "article_id": 2,
            "author": "lurker",
            "body": "Yes, good",
            "comment_id": 19,
            "created_at": expect.any(String),
            "votes": 0,
        })
    })
})



describe('POST /api/articles', () => {
    test('Response 201 and posted article returned if valid article', async () => {
        const newArticle = {
            title: "testArticle",
            topic: "mitch",
            author: "butter_bridge",
            body: "Lorem ipsum dolor sit amet",
        }
        const { body: { article } } = await request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(201)

        expect(article).toEqual(
            {
                article_id: expect.any(Number),
                votes: 0,
                created_at: expect.any(String),
                title: "testArticle",
                topic: "mitch",
                author: "butter_bridge",
                body: "Lorem ipsum dolor sit amet",
                comment_count: "0"
            })
    })
    test('Error if too many arguments suppplied', async () => {
        const newArticle = {
            title: "testArticle",
            topic: "mitch",
            author: "butter_bridge",
            body: "Lorem ipsum dolor sit amet",
            article_id: 1
        }
        const { body: { message } } = await request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(400)

        expect(message).toBe('articles expects 4 arguments\nReceived 5 arguments')
    })
    test('Error if insufficient arguments suppplied', async () => {
        const newArticle = {
            title: "testArticle",
            topic: "mitch",
            author: "butter_bridge",
        }
        const { body: { message } } = await request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(400)

        expect(message).toBe('articles expects 4 arguments\nReceived 3 arguments')

    })
    test('Error if invalid arguments suppplied', async () => {
        const newArticle = {
            title: "testArticle",
            topic: "mitch",
            author: "butter_bridge",
            corpus: "Lorem ipsum dolor sit amet",
        }
        const { body: { message } } = await request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(400)

        expect(message).toBe('Invalid property corpus for table articles')
    })
})





describe('DELETE api/articles/:article_id', () => {
    test('status 204', () => {
        return request(app)
            .delete('/api/articles/2')
            .expect(204)
    })
})