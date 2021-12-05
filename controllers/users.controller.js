const { selectUsers, selectUserById, selectUserComments } = require('../models/users.model');
const { getThis } = require('./functions.controller')

exports.getUsers = (req, res, next) =>
    getThis(req, res, next, selectUsers, 'users');

exports.getUserById = (req, res, next) =>
    getThis(req, res, next, selectUserById, 'user');

exports.getUserComments = (req, res, next) =>
    getThis(req, res, next, selectUserComments, 'comments');