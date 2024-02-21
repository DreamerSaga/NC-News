const db = require('../db/connection');

exports.selectAllArticles = () => {
    const query = `
        SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url , COUNT(comments.comment_id) AS comment_count 
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;
    `;
   
    return db.query(query)
        .then((result) => {
            //console.log(rows)
            return result.rows ;
        })
        .catch(error => {
            throw error;
        });
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
