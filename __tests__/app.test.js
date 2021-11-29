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

// describe('', () => {
//     test('', () => {

//     })
// })