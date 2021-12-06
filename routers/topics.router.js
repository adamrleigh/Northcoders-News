const topicsRouter = require('express').Router();
const { getTopics, getTopicById, postTopic, deleteTopic } = require('../controllers/topics.controller');


topicsRouter
    .route('/')
    .get(getTopics)
    .post(postTopic);

topicsRouter
    .route('/:slug')
    .get(getTopicById)
    .delete(deleteTopic);

module.exports = topicsRouter;