const db = require('../db/connection');
const { getFrom, addTo } = require('./functions.model');

exports.selectTopics = () =>
    getFrom('topics');

exports.addTopic = (id, newTopic) =>
    addTo('topics', newTopic);