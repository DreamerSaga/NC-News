# Northcoders News API

This repository contains the source code for an API that provides various endpoints to interact with a news site. This readme will guide you through setting up the project, explain the technology stack, and describe the core features and available endpoints.

## Getting Started

Clone the repository

        git clone https://github.com/DreamerSaga/NC-News.git

Run command

        npm install


## Create the following files and add data to each file respectively:

**./.env.test** 

        PGDATABASE = nc_news_test;

**./.env.dev**

        PGDATABASE = nc_news;

**./.gitignore**
        .env.*


## Technology Stack

The News Site API is built using the following technologies:

    Node.js
    PostgreSQL
    Express.js
    pg (PostgreSQL client for Node.js)
    Jest (for testing)
    Supertest (for testing HTTP endpoints)

## Available Endpoints

**GET /api/topics**  --->  responds with a list of topics

**GET /api**  --->  responds with a list of available endpoints

**GET /api/articles/:article_id**  --->  responds with a single article by article_id

**GET /api/articles** --->  responds with a list of articles

**GET /api/articles/:article_id/comments**  --->  responds with a list of comments by article_id

**POST /api/articles/:article_id/comments**  --->  add a comment by article_id

**PATCH /api/articles/:article_id**  --->  updates an article by article_id

**DELETE /api/comments/:comment_id**  --->  deletes a comment by comment_id

**GET /api/users**  --->  responds with a list of users

**GET /api/articles (queries)**  --->  allows articles to be filtered and sorted

**GET /api/articles/:article_id (comment count)**  --->  adds a comment count to the response when retrieving a single article
