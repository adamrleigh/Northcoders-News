const db = require("../db/connection");
const format = require("pg-format");
const { selectTopicById } = require("./topics.model");

const articleSelection =
  "articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, COUNT(comments.comment_id) AS comment_count";

exports.selectArticles = async (req) => {
  if (req.query.topic)
    await selectTopicById({ params: { slug: req.query.topic } });

  const selection = articleSelection + ",COUNT(*) OVER () AS total_count";
  const query = format(
    `SELECT ${selection} FROM articles
    LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
    ${req.query.topic ? `WHERE articles.topic = $1` : ""}
    GROUP BY articles.article_id
    ORDER BY %I ${req.query.order || "desc"}
    ${
      req.query.limit
        ? `LIMIT ${req.query.limit} OFFSET ${
            ((req.query.p || 1) - 1) * req.query.limit
          }`
        : ""
    }
    ;`,
    req.query.sort_by || "created_at"
  );

  const { rows: articles } = req.query.topic
    ? await db.query(query, [req.query.topic])
    : await db.query(query);

  return articles;
};

exports.selectArticleById = async (req) => {
  const { rows: articles } = await db.query(
    `
    SELECT ${articleSelection}, articles.body FROM articles
    LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    ;`,
    [req.params.article_id]
  );
  if (!articles[0])
    throw {
      status: 404,
      message: `article with article_id '${req.params.article_id}' not found`,
    };
  return articles[0];
};

exports.selectArticleComments = async (req) => {
  await this.selectArticleById(req);
  const query = format(
    `
    SELECT comment_id, votes, created_at, author, body, COUNT(*) OVER () AS total_count FROM comments 
    WHERE comments.article_id = $1
    ORDER BY %I ${req.query.order || "desc"}
    ${
      req.query.limit
        ? `LIMIT ${req.query.limit} OFFSET ${
            ((req.query.p || 1) - 1) * req.query.limit
          }`
        : ""
    }
    `,
    req.query.sort_by || "created_at"
  );

  const { rows: comments } = await db.query(query, [req.params.article_id]);

  return comments;
};

exports.updateArticle = async (req) => {
  await this.selectArticleById(req);
  const { rows: articles } = await db.query(
    `
    UPDATE articles
    SET votes = votes ${req.body.inc_votes > 0 ? "+" : "- "} $1
    WHERE article_id = $2
    RETURNING *
    ;`,
    [
      req.body.inc_votes ? Math.abs(req.body.inc_votes) : 0,
      req.params.article_id,
    ]
  );
  return articles[0];
};

exports.addComment = async (req) => {
  await this.selectArticleById(req);
  const { rows: comments } = await db.query(
    `
    INSERT INTO comments 
    (author, body, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *;`,
    [req.body.author, req.body.body, req.params.article_id]
  );
  return comments[0];
};

exports.addArticle = async (req) => {
  const { rows: articles } = await db.query(
    `
    INSERT INTO articles 
    (author, body, title, topic)
    VALUES
    ($1, $2, $3, $4)
    RETURNING article_id;`,
    [req.body.author, req.body.body, req.body.title, req.body.topic]
  );
  return this.selectArticleById({ params: articles[0] });
};

exports.removeArticle = async (req) => {
  await this.selectArticleById(req);
  db.query(
    `
    DELETE FROM articles WHERE article_id = $1;`,
    [req.params.article_id]
  );
};
