const db = require('../connection');
const format = require('pg-format')

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  //CREATE TABLES
  return db.query(`
    DROP TABLE IF EXISTS topics, articles, users, comments;
    `).then(() => {
    return db.query(`
      CREATE TABLE topics (
        slug TEXT PRIMARY KEY,
        description TEXT
      );
      `).then(() => {
      return db.query(`
        CREATE TABLE users (
          username VARCHAR(50) PRIMARY KEY,
          avatar_url TEXT,
          name VARCHAR (100)
        )
        `).then(() => {
        return db.query(`
           CREATE TABLE articles (
             article_id SERIAL PRIMARY KEY,
             title TEXT,
             body TEXT,
             votes INT DEFAULT 0,
             topic TEXT NOT NULL REFERENCES topics(slug) ON DELETE CASCADE,
             author VARCHAR(50) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
           )
           `).then(() => {
          return db.query(`
             CREATE TABLE comments (
               comment_id SERIAL PRIMARY KEY,
               author VARCHAR(50) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
               article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
               votes INT DEFAULT 0,
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               body TEXT
             )
             `).then(() => {
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
            return db.query(topicsInsertQuery);
          }).then(() => {
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
            return db.query(usersInsertQuery);
          }).then(() => {
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
            return db.query(articlesInsertQuery);
          }).then(() => {
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
            return db.query(commentsInsertQuery);
          })
        })
      })
    })
  })
};

module.exports = seed;
