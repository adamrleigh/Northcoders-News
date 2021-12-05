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
    test('Status 200 and returns endpoints.json', async () => {
        const { text } = await request(app).get('/api')
            .expect(200);
        expect(JSON.parse(text)).toEqual(endpoints)
    })
})

describe('GET /api/topics', () => {
    test('Status 200 and returns object with key topics containing array of topics', async () => {
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
    test('If topic valid and exists: Status 201 and return topic', async () => {
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
    describe('Invalid post requestes', () => {
        test('Response 400 if insufficient arguments', async () => {
            const newTopic = {
                description: 'This is a new topic',
            }
            const { body: { message } } = await request(app)
                .post('/api/topics')
                .send(newTopic)
                .expect(400)
            expect(message).toEqual('Bad Request Error: too few arguments')

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
            expect(message).toEqual('Bad Request error: column "topic" of relation "topics" does not exist')

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
            expect(message).toEqual('Bad Request error: column \"not_topic\" of relation \"topics\" does not exist')

        })
    })
})

describe('GET /api/articles', () => {
    test('Status 200 and returns object with key articles containing array of articles sorted by date_created desc', async () => {
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
    describe('Sort_by query', () => {
        test('Sorted by valid sort_by query', async () => {
            const { body: { articles } } = await request(app)
                .get('/api/articles?sort_by=title&&order=asc')
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
        test('Invalid sort_by query: status 400', async () => {
            const { body: { articles } } = await request(app)
                .get('/api/articles?sort_by=sesame&&order=asc')
                .expect(400);
        })
    })
    describe('Order query', () => {
        test('Ordered by valid order query', async () => {
            const { body: { articles } } = await request(app)
                .get('/api/articles?sort_by=author&&order=desc')
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
        test('If order query invalid: Status 400', async () => {
            const { body: { articles } } = await request(app)
                .get('/api/articles?sort_by=author&&order=backwards')
                .expect(400);
        })
    })
    describe('topic query', () => {
        test('Filtered by topic if topic exists and has associated article(s)', async () => {
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
        test('If topic exists but has no associated articles: Status 200 and empty array', async () => {
            const { body: { articles } } = await request(app)
                .get('/api/articles?topic=paper')
                .expect(200);

            expect(articles).toEqual(
                []
            )
        })

        test('If topic does not exist: status 404', async () => {
            const { body: { articles } } = await request(app)
                .get('/api/articles?topic=not-a-topic')
                .expect(404);
        })
    })

    test('Results can be limited by limit query', async () => {
        const { body: { articles } } = await request(app)
            .get('/api/articles?limit=2')
            .expect(200)

        expect(articles).toHaveLength(2);
    })

    test('Pagination returns correct page', async () => {
        const { body: { articles } } = await request(app)
            .get('/api/articles?sort_by=article_id&&order=asc&&limit=5&&p=2')
            .expect(200);

        expect(articles.map(article => article.article_id)).toEqual([6, 7, 8, 9, 10])
    })
})

describe('GET /api/articles/:article_id', () => {
    test('If article exists: Status 200 and returns object with key article containing correct article', async () => {
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
    describe('Bad article_id parameter', () => {
        test('if article_id is valid but not found: Status 404', async () => {
            const { body: { message } } = await request(app)
                .get('/api/articles/1000')
                .expect(404)
        })

        test('if article_id is invalid: Response 400 ', async () => {
            const { body: { message } } = await request(app)
                .get('/api/articles/bad')
                .expect(400);
        })
    })
})

describe('GET /api/articles/:article_id/comments', () => {
    test('If article_id exists and article has comments: Status 200 and returns array containing comment objects', async () => {
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

    test('Pagination works for comments', async () => {
        const { body: { comments } } = await request(app)
            .get('/api/articles/1/comments?sort_by=comment_id&&limit=3&&p=2')
            .expect(200);

        expect(comments.map(comment => comment.comment_id)).toEqual([5, 6, 7])
    })

    test('If article_id exists but article has no comments: Response 200 and returns empty array', async () => {
        const { body: { comments } } = await request(app)
            .get('/api/articles/2/comments')
            .expect(200);
        expect(comments).toEqual([]);
    })
    test('If article_id is valid but article not found: Response 404', async () => {
        const { body: { comments } } = await request(app)
            .get('/api/articles/1000/comments')
            .expect(404);
    })
    test('If article_id is invalid: Response 400 and returns array containing comment objects', async () => {
        const { body: { comments } } = await request(app)
            .get('/api/articles/egg/comments')
            .expect(400);
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
    test('If article_id exists and inc_votes is positive: Status 200 and returns updated article', async () => {
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
    test('If article_id exists and inc_votes is negative: Status 200 and returns updated article', async () => {
        newObj = { inc_votes: -100 }
        const { body: { article } } = await request(app)
            .patch('/api/articles/1')
            .send(newObj)
            .expect(200);

        expect(article).toEqual({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            body: 'I find this existence challenging',
            votes: 0,
            topic: 'mitch',
            author: 'butter_bridge',
            created_at: "2020-07-09T20:11:00.000Z",
        })
    })
    test('If extra arguments are supplied they are ignored and only votes is altered', async () => {
        const newObj = { inc_votes: 100, title: 'hello there' };
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
    test('If article_id exists and empty body supplied: Status 200 and return unchanged article', async () => {
        const newObj = {};
        const { body: { article } } = await request(app)
            .patch('/api/articles/1')
            .send(newObj)
            .expect(200);

        expect(article).toEqual({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            body: 'I find this existence challenging',
            votes: 100,
            topic: 'mitch',
            author: 'butter_bridge',
            created_at: "2020-07-09T20:11:00.000Z",
        })
    })
    test('If valid id supplied but not found: Status 404', async () => {
        newObj = { inc_votes: -100 }
        const { body: { article } } = await request(app)
            .patch('/api/articles/100')
            .send(newObj)
            .expect(404);
    })
})



describe('PATCH /api/comments/:article_id', () => {
    test('If article_id exists and inc_votes is positive: Status 200 and returns updated article', async () => {
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
    test('If article_id exists and inc_votes is positive: Status 200 and returns updated article', async () => {
        newObj = { inc_votes: -16 }
        const { body: { comment } } = await request(app)
            .patch('/api/comments/1')
            .send(newObj)
            .expect(200);

        expect(comment).toEqual({
            article_id: 9,
            "body": "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            "comment_id": 1,
            "created_at": "2020-04-06T12:17:00.000Z",
            "votes": 0,
            author: 'butter_bridge'
        })
    })
    test('If extra arguments are supplied they are ignored and only votes is altered', async () => {
        const newObj = { inc_votes: 100, title: 'hello there' };
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
    test('If article_id exists and empty body supplied: Status 200 and return unchanged article', async () => {
        const newObj = {};
        const { body: { comment } } = await request(app)
            .patch('/api/comments/1')
            .send(newObj)
            .expect(200);

        expect(comment).toEqual({
            article_id: 9,
            "body": "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            "comment_id": 1,
            "created_at": "2020-04-06T12:17:00.000Z",
            "votes": 16,
            author: 'butter_bridge'
        })
    })
    test('If valid id supplied but not found: Status 404', async () => {
        newObj = { inc_votes: -100 }
        const { body: { article } } = await request(app)
            .patch('/api/comments/1000')
            .send(newObj)
            .expect(404);
    })
})









describe('DELETE /api/comments/:comment_id', () => {
    test('If comment exists: Status 204', () => {
        return request(app)
            .delete('/api/comments/1')
            .expect(204)
    })
    test('If comment_id is valid but comment does not exist: Status 404', () => {
        return request(app)
            .delete('/api/comments/1000')
            .expect(404)
    })
    test('If article_id invalid: Status 400', () => {
        return request(app)
            .delete('/api/comments/bad')
            .expect(400)
    })
})


describe('GET /api/users/:username', () => {
    test('If username exists: Status 200 and returns object with key user containing user', async () => {
        const { body: { user } } = await request(app)
            .get('/api/users/lurker')
            .expect(200)

        expect(user).toEqual({
            "avatar_url": "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            "name": "do_nothing",
            "username": "lurker",
        })
    })
    test('If username does not exist: Status 404', async () => {
        const { body: { user } } = await request(app)
            .get('/api/users/beserker')
            .expect(404);
    })
})


describe('POST /api/articles/:article_id/comments', () => {
    test('If article exists and valid comment: Status 201 and returns newly inserted comment in an object with key of comment', async () => {
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
    test('If article exists and invalid comment: Status 400', async () => {
        const newComment = {
            author: `lurker`,
            body: `Yes, good`,
            comment_id: 10
        }
        const { body: { comment } } = await request(app)
            .post('/api/articles/2/comments')
            .send(newComment)
            .expect(400)
    })
    test('If article_id valid but does not exist: Status 404', async () => {
        const newComment = {
            author: `lurker`,
            body: `Yes, good`
        }
        const { body: { comment } } = await request(app)
            .post('/api/articles/1000/comments')
            .send(newComment)
            .expect(404)
    })
})



describe('POST /api/articles', () => {
    test('If article includes compulsory fields: Status 201 and posted article returned', async () => {
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

    test('If too many arguments suppplied: Status 400', async () => {
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

        expect(message).toBe('Bad Request error: bind message supplies 5 parameters, but prepared statement "" requires 4')
    })
    test('If too few arguments supplied: Status 400', async () => {
        const newArticle = {
            title: "testArticle",
            topic: "mitch",
            author: "butter_bridge",
        }
        const { body: { message } } = await request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(400)

        expect(message).toBe('Bad Request Error: too few arguments')

    })
    test('If correct number, but invalid arguments suppplied', async () => {
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

        expect(message).toBe('Bad Request error: column \"corpus\" of relation \"articles\" does not exist')
    })
})
describe('DELETE api/articles/:article_id', () => {
    test('If article exists: Status 204', () => {
        return request(app)
            .delete('/api/articles/2')
            .expect(204)
    })
    test('If valid ID but article does not exist: Status 404', () => {
        return request(app)
            .delete('/api/articles/1000')
            .expect(404)
    })
    test('If invalid ID: Status 400', () => {
        return request(app)
            .delete('/api/articles/adam')
            .expect(400)
    })
})




