const db = require("../db/connection")
const {usernameValidation} = require("../utils/usernameValidation");
const {selectArticle} = require("../models/article.model.js")


exports.selectCommentsByArticleId = (article_id) => {
    let articlesCount = 0;
    
    return db.query(`SELECT COUNT(*) FROM articles;`)
    .then((articleCount) => {
        articlesCount = Number(articleCount.rows[0].count)
    })
    .then(() => {
        return db.query(`
            SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body 
            FROM comments 
            JOIN articles ON articles.article_id = comments.article_id 
            WHERE articles.article_id = $1 ORDER BY created_at DESC;`, [article_id])})
            .then(({ rows }) => {

        if (rows.length === 0 && article_id <= articlesCount) { return rows }

        else if (rows.length === 0 && article_id > articlesCount) { return Promise.reject({ status: 404, msg: `No comments found for article_id: ${article_id}` }) }
        
        else return rows
    })

    // return db.query(`
    // SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body 
    // FROM comments 
    // WHERE comments.article_id = $1 
    // ORDER BY created_at DESC;`, [article_id])
    // .then(({ rows }) => {
    //     console.log(rows,"<-------- HERE")
    //   if (rows.length === 0) {
    //     return Promise.reject({ status: 404, msg: `No comments found for article_id: ${article_id}` });
    //   }
    //   return rows;
    // });
}


exports.insertCommentByArticleId = (req, res) => {
   
    if (!Object.keys(req.body).includes("body" && "username")) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      }
    
      const values = [req.body.body, req.params.article_id, req.body.username];
      //console.log(values, "HERE")
      const sqlQuery = `INSERT INTO comments
      (body, article_id, author)
      VALUES
      ($1, $2, $3)
      RETURNING *`;
    
      return selectArticle(req.params.article_id)
        .then(() => {
          return usernameValidation(req.body.username);
        })
        .then(() => {
          return db.query(sqlQuery, values);
        })
        .then(({ rows }) => {
            //console.log(rows[0], "HERE")
            return rows[0];
        });
    }


exports.deleteCommentByCommentId = (commentId) => {
    const sqlQuery = `DELETE FROM comments WHERE comment_id = $1`;
    return db.query(sqlQuery, [commentId]).then((result) => {
      if (result.rowCount === 0)
        return Promise.reject({ status: 404, msg: "No comments found" });
    });
  }
  