const { selectUsers, selectUserById } = require('../models/users.model');
const { getThis } = require('./functions.controller')

exports.getUsers = (req, res, next) =>
    getThis(req, res, next, selectUsers, 'users');

exports.getUserById = (req, res, next) =>
    getThis(req, res, next, selectUserById, 'user');
