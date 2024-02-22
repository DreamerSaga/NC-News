const {selectCommentsByArticleId, insertCommentByArticleId, deleteCommentByCommentId} = require("../models/comments.model.js")


exports.getAllCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    selectCommentsByArticleId(article_id).then((comments) => {
        res.status(200).send({ comments });
    })
        .catch(next);
}


exports.postCommentByArticleId= (req, res, next) => {
    insertCommentByArticleId(req)
    .then((data) => {
      res.status(201).send({ comment: data });
    })
    .catch((err) => next(err));
}

exports.deleteCommentById = (req, res, next) => {
    deleteCommentByCommentId(req.params.comment_id)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  }