const { readAllTopics}  = require("../models/topics.model");

exports.getAllTopics = (req, res, next) => {
    readAllTopics()
    .then((topics) => {
        res.status(200).send({ topics });
    })
    .catch(next)
};

