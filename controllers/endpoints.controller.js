const endPoints = require("../endpoints.json")

exports.getAllEndpoints = (req, res) => {
    return res.status(200).send(endPoints)
}