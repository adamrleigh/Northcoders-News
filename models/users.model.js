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
  return users[0];
};

exports.selectUserComments = async (req) => {
  await this.selectUserById(req);
  const { rows: comments } = await db.query(
    `
    SELECT *, COUNT(*) OVER () as total_count FROM comments 
    WHERE author = $1
    ${
      req.query.limit
        ? `LIMIT ${req.query.limit} OFFSET ${
            ((req.query.p || 1) - 1) * req.query.limit
          }`
        : ""
    }
    `,
    [req.params.username]
  );
  return comments;
};

exports.selectUserArticles = async (req) => {
  const selection = articleSelection + ",COUNT(*) OVER () AS total_count";
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
