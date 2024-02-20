const db = require('../db/connection');

exports.readAllTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) => {
        return rows 
    })
 
}
