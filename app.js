const express = require('express')
const cors = require('cors');
const {getAllTopics}  = require("./controllers/topics.controller.js")
const {getAllEndpoints} = require("./controllers/endpoints.controller.js")
const {getAllArticles, getArticlesById, patchArticleById} = require("./controllers/article.controller.js")
const {getAllCommentsByArticleId, postCommentByArticleId, deleteCommentById} = require("./controllers/comments.controller.js")
const {getAllUsers} = require("./controllers/user.controller.js")
const {handleCustomErrors, handlePsqlErrors, handleServerErrors} = require("./errors.js")

const app = express();

app.use(cors());

app.use(express.json());


app.get("/api/topics", getAllTopics)
app.get("/api", getAllEndpoints)

app.get("/api/articles", getAllArticles)
app.get("/api/articles/:article_id", getArticlesById)

app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId)
app.post("/api/articles/:article_id/comments",postCommentByArticleId)

app.patch("/api/articles/:article_id", patchArticleById) 
app.delete("/api/comments/:comment_id", deleteCommentById)

app.get("/api/users", getAllUsers)

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);


module.exports = app