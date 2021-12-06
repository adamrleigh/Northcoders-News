const { selectUsers, selectUserById, addUser, selectUserComments, removeUser } = require('../models/users.model');
const { getThis, postThis, deleteThis } = require('./functions.controller')

exports.getUsers = (req, res, next) =>
    getThis(req, res, next, selectUsers, 'users');

exports.getUserById = (req, res, next) =>
    getThis(req, res, next, selectUserById, 'user');

exports.postUser = (req, res, next) =>
    postThis(req, res, next, addUser, 'user');

exports.getUserComments = (req, res, next) =>
    getThis(req, res, next, selectUserComments, 'comments');

exports.deleteUser = (req, res, next) =>
    deleteThis(req, res, next, removeUser);