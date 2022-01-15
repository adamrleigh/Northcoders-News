const format = require("pg-format");
const { getUserArticles } = require("../controllers/users.controller");
const db = require("../db/connection");

const articleSelection =
  "articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, COUNT(comments.comment_id) AS comment_count";

exports.selectUsers = async () => {
  const { rows: users } = await db.query(`
    SELECT username FROM users
    `);
  return users;
};

exports.selectUserById = async (req) => {
  const { rows: users } = await db.query(
    `
    SELECT * FROM users
    WHERE username = $1
    ;`,
    [req.params.username]
  );
  if (!users[0])
    throw {
      status: 404,
      message: `user with username '${req.params.username}' not found`,
    };

  try {
    let articleStats = await getUserArticleStats(req.params.username);
    const commentStats = await getUserCommentStats(req.params.username);
    const [articleCount, commentCount] = [
      (articleStats[0] && articleStats[0].total_article_count) || 0,
      (commentStats[0] && commentStats[0].total_comment_count) || 0,
    ];
    const totalVotes =
      (Number(articleStats[0] && articleStats[0].article_votes) || 0) +
      (Number(commentStats[0] && commentStats[0].comment_votes) || 0);
    return {
      ...users[0],
      article_count: Number(articleCount),
      comment_count: Number(commentCount),
      total_votes: totalVotes,
    };
  } catch (err) {
    console.log(err);
  }
};

exports.selectUserComments = async (req, skip = false) => {
  if (!skip) await this.selectUserById(req);
  const query = format(
    `
    SELECT *, COUNT(*) OVER () as total_count, SUM(votes) OVER () as comment_votes FROM comments 
    WHERE author = $1
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

  const { rows: comments } = await db.query(query, [req.params.username]);

  return comments;
};

exports.selectUserArticles = async (req) => {
  const selection =
    articleSelection +
    ",COUNT(*) OVER () AS total_count, SUM(articles.votes) (OVER) as user_votes";
  const query = format(
    `SELECT ${selection} FROM articles
    LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.author = $1
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

  const { rows: articles } = await db.query(query, [req.params.username]);

  return articles;
};

exports.removeUser = async (req) => {
  await this.selectUserById(req);
  db.query(
    `
    DELETE FROM users WHERE username = $1;`,
    [req.params.username]
  );
};

exports.addUser = async (req) => {
  const { rows } = await db.query(
    `
        INSERT INTO users
        (username, avatar_url, name)
        VALUES
        ($1, $2, $3)
        RETURNING *;`,
    [req.body.username, req.body.avatar_url, req.body.name]
  );
  return rows[0];
};

const getUserCommentStats = async (username) => {
  const query = `
    SELECT Distinct COUNT(*) OVER () as total_comment_count, SUM(votes) OVER () as comment_votes FROM comments
    WHERE author = $1;
    `;

  const { rows: commentStats } = await db.query(query, [username]);

  return commentStats;
};

const getUserArticleStats = async (username) => {
  const query = `
    SELECT Distinct COUNT(*) OVER () as total_article_count, SUM(votes) OVER () as article_votes FROM articles
    WHERE author = $1;
    `;

  const { rows: articleStats } = await db.query(query, [username]);

  return articleStats;
};
