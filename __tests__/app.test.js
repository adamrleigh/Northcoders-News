const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');
const app = require('../app');
require('jest-sorted');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api', () => {
    test('Response 200 and returns message: all ok', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                expect(body.message).toEqual('all ok');
            })
    })
})

describe('GET /api/topics', () => {
    test('Response 200 and returns object with key topics containing array of topics', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                expect(body.topics).toEqual([
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
})

describe('GET /api/articles', () => {
    test('Response 200 and returns object with key articles containing array of articles', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toHaveLength(12);
                body.articles.forEach(article => {
                    expect(article).toEqual(expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number)
                    }))
                })
            })
    })
})

describe('GET /api/articles/:article_id', () => {
    test('Response 200 and returns object with key article containing correct article if article exists', () => {
        return request(app)
            .get('/api/articles/2')
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toEqual({
                    "article_id": 2,
                    "author": "icellusedkars",
                    "body": "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                    "created_at": "2020-10-16T05:03:00.000Z",
                    "title": "Sony Vaio; or, The Laptop",
                    "topic": "mitch",
                    "votes": 0
                })
            })
    })
    test('Response 400 and appropriate message if article_id is a number but article does not exist', () => {
        return request(app)
            .get('/api/articles/10000000')
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toEqual('Article with id 10000000 not found')
            })
    })

    test('Response 400 and appropriate message if article_id is not a number', () => {
        return request(app)
            .get('/api/articles/bad')
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toEqual('Article id must be a number')
            })
    })
})


// describe('', () => {
//     test('', () => {

//     })
// })