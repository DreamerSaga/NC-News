const db = require('../db/connection');


exports.selectAllArticles = (topic) => {
    let query = `
    SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url , COUNT(comments.comment_id) AS comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id`;
   
   //console.log(topic)
    if (topic) {
      query += ` WHERE articles.topic = $1`; 
    }
    
    query += ` GROUP BY articles.article_id
              ORDER BY articles.created_at DESC;`;

    const values = topic ? [topic] : [];
    //console.log(query, values)
 
    return db.query(query, values)
        .then((result) => {
            //console.log(result.rows)
            return result.rows ;
        })
};

exports.selectArticle = (id) => {
    return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found`,
        });
      }
      //console.log(article)
      return article;
    });
}

exports.updateArticleVotesByArticleId = (updatedVoteCount, article_id) => {
  const values = [updatedVoteCount, article_id];
  return db.query(`UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`,values)
    .then(({ rows }) => {
      return rows[0];
    });
};


//  /api/articles/:article_id (comment_count)
exports.selectArticleWithCommentCount = (id) => {
  return db
  .query(`
      SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;
  `, [id])
  .then(({ rows }) => {
    const article = rows[0];
    if (!article) {
      return Promise.reject({
        status: 404,
        msg: `No article found`,
      });
    }
    return article;
  });
};
