const express = require('express')
const {getAllTopics}  = require("./controllers/topics.controller.js")
const {handleCustomErrors, handlePsqlErrors, handleServerErrors} = require("./errors.js")
// const endpointsData = require('./endpoints.json')

const app = express();
app.use(express.json())

app.get("/api/topics", getAllTopics)

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app