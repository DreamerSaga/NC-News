const express = require('express')
const {getAllTopics}  = require("./controllers/topics.controller.js")
const {getAllEndpoints} =require("./controllers/endpoints.controller.js")
const {handleCustomErrors, handlePsqlErrors, handleServerErrors} = require("./errors.js")


const app = express();
app.use(express.json())

app.get("/api/topics", getAllTopics)
app.get("/api", getAllEndpoints)

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app