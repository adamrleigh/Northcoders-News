const apiRouter = require('express').Router();
const articlesRouter = require('./articles.router');
const commentsRouter = require('./comments.routers');
const topicsRouter = require('./topics.router');
const usersRouter = require('./users.router');

apiRouter
    .route('/')
    .get((req, res) => {
        res.status(200).send({ message: 'all ok' })
    });

apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;