const db = require("../db/connection")


exports.selectCommentsByArticleId = (article_id) => {
    //    return db.query(`
    //     SELECT comment_id, body, author, votes, created_at 
    //     FROM comments 
    //     WHERE article_id = $1`, [article_id])
    //     .then(({rows}) => {
    //         if(!rows[0]) {
    //             return Promise.reject({
    //                 status: 404,
    //                 msg : `No comments found for article_id: ${article_id}`
    //             })
    //         }
    //         return rows
    //     })
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
}
