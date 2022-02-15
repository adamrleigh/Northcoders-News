const {
  selectTopics,
  selectTopicById,
  addTopic,
  removeTopic,
} = require("../models/topics.model");
const { getThis, postThis, deleteThis } = require("./functions.controller");

exports.getTopics = (...controllerArgs) =>
  getThis(...controllerArgs, selectTopics, "topics");

exports.getTopicById = (...controllerArgs) =>
  getThis(...controllerArgs, selectTopicById, "topic");

exports.postTopic = (...controllerArgs) =>
  postThis(...controllerArgs, addTopic, "topic");

exports.deleteTopic = (...controllerArgs) =>
  deleteThis(...controllerArgs, removeTopic);
