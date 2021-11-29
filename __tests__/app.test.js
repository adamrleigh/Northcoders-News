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

// describe('', () => {
//     test('', () => {

//     })
// })