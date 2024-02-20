const { selectAllArticles, selectArticle }  = require("../models/article.model.js");

exports.getAllArticles = (req,res,next) => {
    selectAllArticles()
    .then(articles => {
        res.status(200).send({ articles });
    })
    .catch(next);
}

exports.getArticlesById = (req, res, next) => {
    const id = req.params.article_id
    selectArticle(id)
    .then(article => {
        res.status(200).send({article})
    })
    .catch(err => {
        next(err)
    })
}