const usersRouter = require('express').Router();
const { getUsers, getUserById } = require('../controllers/users.controller');


usersRouter
    .route('/')
    .get(getUsers);

usersRouter
    .route('/:user_id')
    .get(getUserById);

module.exports = usersRouter;