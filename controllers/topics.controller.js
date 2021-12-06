const { selectTopics, selectTopicById, addTopic, removeTopic } = require('../models/topics.model');
const { getThis, postThis, deleteThis } = require('./functions.controller');

exports.getTopics = (req, res, next) =>
    getThis(req, res, next, selectTopics, 'topics');

exports.getTopicById = (req, res, next) =>
    getThis(req, res, next, selectTopicById, 'topic');

exports.postTopic = (req, res, next) =>
    postThis(req, res, next, addTopic, 'topic');

exports.deleteTopic = (req, res, next) =>
    deleteThis(req, res, next, removeTopic);