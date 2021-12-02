const apiRouter = require('express').Router();
const articlesRouter = require('./articles.router');
const commentsRouter = require('./comments.routers');
const topicsRouter = require('./topics.router');
const usersRouter = require('./users.router');
const fs = require('fs/promises');

apiRouter
    .route('/')
    .get(async (req, res, next) => {
        try {
            const file = await fs.readFile('/home/adam/northcoders/fundamentals/week7/be-nc-news/endpoints.json', 'utf8');
            res.status(200).send(JSON.parse(file));
        }
        catch (err) {
            next(err)
        }
    });

apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;