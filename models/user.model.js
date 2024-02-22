const db = require('../db/connection');

exports.fetchAllUsers = () => {
    const sqlQuery = `SELECT * FROM users`;
    return db.query(sqlQuery)
    .then(({ rows }) => rows);
}
