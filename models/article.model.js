const db = require('../db/connection');
const { topicValidation } = require('../utils/topicValidation');


exports.selectAllArticles = (topic) => {
  
//   if(topic){
//     console.log(topic)
//    topicValidation(topic)
//    .catch((err) => { return Promise.reject(err)})

// }

  let query = `
  SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url , COUNT(comments.comment_id) AS comment_count 
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;
  //console.log(query)
 
  if (topic) {
     query += ` WHERE articles.topic = $1 GROUP BY articles.article_id
     ORDER BY articles.created_at DESC;`
     return topicValidation(topic).then(()=> {
       return db.query(query, [topic])
     })
     .then((result) => {
     
      return result.rows
     })
  }

  //console.log(query)
  query += ` GROUP BY articles.article_id
            ORDER BY articles.created_at DESC;`;

   return db.query(query)
      .then((result) => {
          //console.log(result.rows)       
          return result.rows ;
      })
    }

exports.selectArticle = (id) => {

  return db.query(`SELECT articles.*,
    COUNT(comments.comment_id)::int AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [id])
    .then(({rows}) => {
        const article = rows[0]
        if(!article) {
            return Promise.reject({
                status: 404,
                msg : `No article found`
            })
        }
        return article
    })
}


exports.updateArticleVotesByArticleId = (updatedVoteCount, article_id) => {
  const values = [updatedVoteCount, article_id];
  return db.query(`UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`,values)
    .then(({ rows }) => {
      return rows[0];
    });
};

