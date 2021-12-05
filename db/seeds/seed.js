const db = require('../connection');
const format = require('pg-format')

const seed = async (data) => {
  const { articleData, commentData, topicData, userData } = data;
  //CREATE TABLES
  await db.query(`DROP TABLE IF EXISTS topics, articles, users, comments;`);
  await db.query(`
      CREATE TABLE topics (
        slug TEXT PRIMARY KEY,
        description TEXT NOT NULL
      );
      `)
  await db.query(`
        CREATE TABLE users (
          username VARCHAR(50) PRIMARY KEY,
          avatar_url TEXT NOT NULL,
          name VARCHAR (100) NOT NULL
        )
        `)
  await db.query(`
           CREATE TABLE articles (
             article_id SERIAL PRIMARY KEY,
             title TEXT NOT NULL,
             body TEXT NOT NULL,
             votes INT DEFAULT 0,
             topic TEXT NOT NULL REFERENCES topics(slug) ON DELETE CASCADE,
             author VARCHAR(50) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
           )
           `)
  await db.query(`
             CREATE TABLE comments (
               comment_id SERIAL PRIMARY KEY,
               author VARCHAR(50) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
               article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
               votes INT DEFAULT 0,
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               body TEXT NOT NULL
             )
             `)
  //MADE ALL TABLES, NOW INSERT DATA
  const formattedTopicData = topicData.map((topic) =>
    [
      topic.description,
      topic.slug
    ]
  )
  const topicsInsertQuery = format(`
              INSERT INTO topics 
              (description, slug)
              VALUES %L;`,
    formattedTopicData
  )


  const formattedUserData = userData.map((user) =>
    [
      user.username,
      user.name,
      user.avatar_url
    ]
  )
  const usersInsertQuery = format(`
              INSERT INTO users 
              (username, name, avatar_url)
              VALUES %L;`,
    formattedUserData
  )

  const formattedArticleData = articleData.map((article) =>
    [
      article.title,
      article.topic,
      article.author,
      article.body,
      article.created_at,
      article.votes
    ]
  )
  const articlesInsertQuery = format(`
              INSERT INTO articles 
              (title, topic, author, body, created_at, votes)
              VALUES %L;`,
    formattedArticleData
  )


  const formattedCommentData = commentData.map((comment) =>
    [
      comment.body,
      comment.votes,
      comment.author,
      comment.article_id,
      comment.created_at
    ]
  )
  const commentsInsertQuery = format(`
              INSERT INTO comments
              (body, votes, author, article_id, created_at)
              VALUES %L;`,
    formattedCommentData
  )

  await db.query(topicsInsertQuery);
  await db.query(usersInsertQuery);
  await db.query(articlesInsertQuery);
  await db.query(commentsInsertQuery);
}

module.exports = seed;
