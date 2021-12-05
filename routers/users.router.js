const usersRouter = require('express').Router();
const { getUsers, getUserById, getUserComments } = require('../controllers/users.controller');


usersRouter
    .route('/')
    .get(getUsers);

usersRouter
    .route('/:username')
    .get(getUserById);

usersRouter
    .route('/:username/comments')
    .get(getUserComments);

module.exports = usersRouter;