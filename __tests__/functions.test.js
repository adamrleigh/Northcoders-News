const { newSelectQuery } = require('../models/functions.model')

describe('newSelectQuery', () => {
    test('Supplying only a table should return all values from that table', () => {
        expect(newSelectQuery('articles')).toBe('SELECT * FROM articles;')
    })

    test('Supplying a table specific values should return a query to select only those values', () => {
        expect(newSelectQuery('articles', 'article_id, votes')).toBe('SELECT article_id, votes FROM articles;')
    })

    test('Supplying a table and ID should return a query that matches only those conditions', () => {
        expect(newSelectQuery('articles', '*', [{ 'article_id': 3 }])).toBe('SELECT * FROM articles WHERE article_id = 3;')
    })

    test('Should be able to join tables', () => {
        expect(newSelectQuery('articles', '*', [], 'comments', 'article_id')).toBe('SELECT * FROM articles JOIN comments ON articles.article_id = comments.article_id;')
    })

    test('Should be able to use group by clause', () => {
        expect(newSelectQuery('articles', 'articles.article_id, COUNT(comments.comment_id)', [], 'comments', 'article_id', 'articles.article_id')).toBe(`
        SELECT articles.article_id, COUNT(comments.comment_id) 
        FROM articles 
        JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id;
        `.replace(/\s+/g, ' ').trim());
    })
})



describe('newPatchQuery', () => {
    test('Supplying a table, id an', () => {
        expect(newSelectQuery('articles')).toBe('SELECT * FROM articles;')
    })
})