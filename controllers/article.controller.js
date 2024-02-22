const { selectAllArticles, selectArticle, updateArticleVotesByArticleId}  = require("../models/article.model.js");
const {checkValidIncVotes} = require("../utils/votesValidation.js")

exports.getAllArticles = (req, res, next) => {
    selectAllArticles()
        .then(articles => {
            res.status(200).send({ articles });
        })
        .catch(next);
};

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

exports.patchArticleById = (req, res, next) => {
    const { inc_votes } = req.body;
    const { article_id } = req.params;

    const promiseArr = [selectArticle(article_id)];
    if (inc_votes) {
    promiseArr.push(checkValidIncVotes(inc_votes));
    }
    Promise.all(promiseArr)
    .then((response) => {
        let newVoteCount = response[0].votes;
        if (inc_votes) newVoteCount += inc_votes;
        updateArticleVotesByArticleId(newVoteCount, article_id).then(
        (article) => {
            res.status(200).send({ article });
        }
        );
    })
    .catch((err) => {
        next(err);
  });
};