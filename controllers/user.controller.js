const {fetchAllUsers} = require("../models/user.model.js")

exports.getAllUsers = (req, res, next) => {
    fetchAllUsers()
      .then((data) => res.status(200).send({ users: data }))
      .catch((err) => next(err));
  }
  