const usersRouter = require('express').Router();
const { getUsers, postUser, getUserById, getUserComments, deleteUser } = require('../controllers/users.controller');


usersRouter
    .route('/')
    .get(getUsers)
    .post(postUser);

usersRouter
    .route('/:username')
    .get(getUserById)
    .delete(deleteUser);

usersRouter
    .route('/:username/comments')
    .get(getUserComments);

module.exports = usersRouter;