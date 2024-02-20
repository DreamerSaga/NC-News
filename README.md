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

- Node.js - v21.6.1

- PostgreSQL - 14.10

- [Express.js](https://expressjs.com/en/starter/installing.html)

- [pg](https://node-postgres.com/) (PostgreSQL client for Node.js)

- [Jest](https://jestjs.io/docs/getting-started) (for testing)

- [Jest-sorted](https://www.npmjs.com/package/jest-sorted)

- [Supertest](https://www.npmjs.com/package/supertest) (for testing HTTP endpoints)

- [dotenv](https://www.npmjs.com/package/dotenv)

## Set up and run

To set-up and seed local database, run: 

        npm run setup-dbs
        
        npm run seed



## Available Endpoints
- **GET /api**  --->  responds with a list of available endpoints

### Topics
- **GET /api/topics**  --->  responds with a list of topics

### Articles
- **GET /api/articles** --->  responds with a list of articles

- **GET /api/articles (queries)**  --->  allows articles to be filtered and sorted

- **GET /api/articles/:article_id**  --->  responds with a single article by article_id

- **PATCH /api/articles/:article_id**  --->  updates an article by article_id

### Comments
- **GET /api/articles/:article_id/comments**  --->  responds with a list of comments by article_id

- **GET /api/articles/:article_id (comment count)**  --->  adds a comment count to the response when retrieving a single article

- **POST /api/articles/:article_id/comments**  --->  add a comment by article_id

- **DELETE /api/comments/:comment_id**  --->  deletes a comment by comment_id

### Users
- **GET /api/users**  --->  responds with a list of users


## Now you're ready to use the API!

To run the server with the development database, use the command **npm start**. 

To run tests (which will use the test database) use **npm test**. There are two test files located in __tests__ and you can specify **npm test app** to only run *app.test.js* or **npm test utils** to only run *utils.test.js*.

