const apiRouter = require('express').Router();
const articlesRouter = require('./articles.router');
const commentsRouter = require('./comments.routers');
const topicsRouter = require('./topics.router');
const usersRouter = require('./users.router');
const endpoints = require('../endpoints.json');

apiRouter
    .route('/')
    .get((req, res, next) => {
        res.status(200).send(endpoints);
    });

apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;