const {
  selectUsers,
  selectUserById,
  addUser,
  selectUserComments,
  removeUser,
  selectUserArticles,
} = require("../models/users.model");
const { getThis, postThis, deleteThis } = require("./functions.controller");

exports.getUsers = (...controllerArgs) =>
  getThis(...controllerArgs, selectUsers, "users");

exports.getUserById = (...controllerArgs) =>
  getThis(...controllerArgs, selectUserById, "user");

exports.postUser = (...controllerArgs) =>
  postThis(...controllerArgs, addUser, "user");

exports.getUserComments = (...controllerArgs) =>
  getThis(...controllerArgs, selectUserComments, "comments");

exports.getUserArticles = (...controllerArgs) =>
  getThis(...controllerArgs, selectUserArticles, "articles");

exports.deleteUser = (...controllerArgs) =>
  deleteThis(...controllerArgs, removeUser);
