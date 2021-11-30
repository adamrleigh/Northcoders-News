const { selectTopics, addTopic } = require('../models/topics.model');
const { getThis, postThis } = require('./functions.controller');

exports.getTopics = (req, res, next) =>
    getThis(req, res, next, selectTopics, 'topics');

exports.postTopic = (req, res, next) =>
    postThis(req, res, next, addTopic, 'topic');