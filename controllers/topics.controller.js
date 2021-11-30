const { selectTopics } = require('../models/topics.model');
const { getThis } = require('./functions.controller');

exports.getTopics = (req, res, next) =>
    getThis(req, res, next, selectTopics, 'topics');

