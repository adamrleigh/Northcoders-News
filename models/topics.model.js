const db = require('../db/connection');
const { getFrom } = require('./functions.model');

exports.selectTopics = () =>
    getFrom('topics');
