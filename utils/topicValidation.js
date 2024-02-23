const db = require("../db/connection");

function topicValidation(topic) {

    return db
      .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
      .then(({ rows }) => {
        //console.log(rows)
        if (rows.length === 0) {
          //console.log("Hellooooo ")
          return Promise.reject({ status: 404, msg: "Topic not found" });
        }
      });
  }

module.exports = { topicValidation };