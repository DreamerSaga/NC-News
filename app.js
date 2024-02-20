const express = require('express')
const {getAllTopics}  = require("./controllers/topics.controller.js")
const {getAllEndpoints} =require("./controllers/endpoints.controller.js")
const {getAllArticles, getArticlesById} =require("./controllers/article.controller.js")
const {handleCustomErrors, handlePsqlErrors, handleServerErrors} = require("./errors.js")


const app = express();


app.get("/api/topics", getAllTopics)
app.get("/api", getAllEndpoints)

app.get("api/articles", getAllArticles)
app.get("/api/articles/:article_id", getArticlesById)



app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app