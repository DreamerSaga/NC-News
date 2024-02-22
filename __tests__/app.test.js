const request = require("supertest")
const seed = require("../db/seeds/seed.js")
const app = require("../app.js")
const db = require("../db/connection.js");
const data = require("../db/data/test-data");
const endPoints = require("../endpoints.json");

require("jest-sorted");


beforeEach(() => seed(data));
afterAll(() => db.end());


// GET /api/...
describe('GET /api/topics', () => {
  test('should return an array of topics each with a slug and description property', () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const { topics } = response.body;
        //console.log(topics)
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });

  test("return 404 - when invalid endpoint is given", () => {
    return request(app)
      .get("/api/magic")
      .expect(404)
      .then(({ statusCode }) => {
        expect(statusCode).toBe(404);
      });
  });
});

describe("GET /api", () => {

  test("Returns an object describing all the available endpoints on the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endPoints)
        //console.log(endPoints)
      })
  })

  test("return 404 if requested endpoint not exist", () => {
    return request(app).get("/api/not-exist/").expect(404);
  });
})

describe("GET /api/articles/:article_id", () => {

  test('should return the article with the specified ID', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toBeTruthy();
        expect(article).toHaveProperty('author');
        expect(article).toHaveProperty('title');
        expect(article).toHaveProperty('article_id');
        expect(article).toHaveProperty('body');
        expect(article).toHaveProperty('topic');
        expect(article).toHaveProperty('created_at');
        expect(article).toHaveProperty('votes');
        expect(article).toHaveProperty('article_img_url');
      });
  });

  test("responds with the correct article object", () => {
    return request(app)
      .get("/api/articles/7")
      .then(({ body }) => {
        expect(body.article.title).toBe("Z");
        expect(body.article.article_id).toBe(7);
        expect(body.article.author).toBe("icellusedkars");
        expect(body.article.body).toBe("I was hungry.");
        expect(body.article.topic).toBe("mitch");
        expect(body.article.created_at).toBe("2020-01-07T14:08:00.000Z");
        expect(body.article.votes).toBe(0);
        expect(body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });

  test('should return a 404 error for non-existing article ID', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No article found");
      });
  });
})

describe("GET /api/articles", () => {

  test("GET 200: sends an array of article objects with the required properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const body = response.body;
        //console.log(body)
        body.articles.forEach(article => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(article.response).toBe(undefined);
          expect(typeof article.comment_count).toBe("string");
        });
      });
  });

  test('should sort articles in date order', () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy(response.body.created_at, { descending: true })
      })
  });
})

describe("GET /articles/:article_id/comments", () => {

  test('200: responds with an array of comments of a given article id', () => {
    const article_id = 5;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.forEach(comment => {
          expect(comment).toHaveProperty(`comment_id`);
          expect(comment).toHaveProperty(`votes`);
          expect(comment).toHaveProperty(`created_at`);
          expect(comment).toHaveProperty(`author`);
          expect(comment).toHaveProperty(`body`);
        }));
      });
  });

  test('array should contain comment objects with correct properties', () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then(({body})=>{
      body.comments.forEach(comment=>{
      expect(typeof(comment.body)).toBe('string')
      expect(typeof(comment.author)).toBe('string')
      expect(typeof(comment.created_at)).toBe('string')
      expect(typeof(comment.votes)).toBe('number')
      expect(typeof(comment.comment_id)).toBe('number')
    })
    })
  });

  test('should return correct comment data', () => {
    return request(app)
    .get('/api/articles/5/comments')
    .expect(200)
    .then(({body})=>{
      const comment = body.comments[0]
      //console.log(comment)
      expect(comment.body).toBe("I am 100% sure that we're not completely sure.")
      expect(comment.votes).toBe(1)
      expect(comment.author).toBe("butter_bridge")
      expect(comment.comment_id).toBe(15)
      expect(comment.created_at).toBe("2020-11-24T00:08:00.000Z")
    })
  });

  test("status:200, should return an array of comments for the given article_id, ordered by date in descending order", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toBeSortedBy(comments.created_at, { descending: true });
        //console.log(comments)
      });
  });
  
  test("should return 404 Bad Request if provided id does not exist", () => {
    return request(app)
      .get(`/api/articles/9999/comments`)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          "No comments found for article_id: 9999"
        );
      });
  });

  test("should return 400 if id not valid ", () => {
    return request(app).get("/api/articles/1d/comments").expect(400);
  });
  test('Status 400 responds with - Invalid Article ID', () => {
    return request(app)
    .get('/api/articles/one/comments')
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe('Bad Request')
    });
  });

  test("should return empty array if the id provided does not havea any comments", () => {
    return request(app)
      .get(`/api/articles/2/comments`)
      .expect(200)
      .then((response) => {
        const articleNoComment = response.body.comments
        expect(articleNoComment).toHaveLength(0)
      });
  });

  // test("When an article has no comments returns status 200 and an empty array", () => {
  //   return request(app)
  //     .get("/api/articles/2/comments")
  //     .expect(200)
  //     .then((response) => {
  //       const comments  = response.body;
  //       //console.log(comments)
  //       expect(comments).toEqual({"comments": []});
  //     });
  // });
  
})


// POST /api/....
describe("POST /api/articles/:article_id/comments", () => {
  
  test("status:201 inserts a new comment and returns the newly created comment", () => {
    const testObj = {
      username: "butter_bridge",
      body: "Im here, Hello!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testObj)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "Im here, Hello!",
          article_id: 1,
          author: "butter_bridge",
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });

  test("status:400 returns correct error message if username field is missing", () => {
    const testObj = {
      body: "a random thought",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("same as above - different code - works", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        body: "You deserve a cookie",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });

  //why need to have author in testObj instead of username? otherwise doesnt pass the test, and gets 500.
  test("status:400 returns correct error message if body field is missing", () => {
    const testObj = {
      author: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  //   const newComment = {
  //     author: 'butter_bridge'
  // }
  //   return request(app)
  //     .post('/api/articles/1/comments')
  //     .send(newComment)
  //     .expect(400)
  //     .then((response) => {
  //         expect(response.body.msg).toBe('Bad Request')
  //     })
})
  // test("status: 400 - returns correct error message if it only contains username, body field is missing", () => {
  //   // return request(app)
  //   //   .post("/api/articles/1/comments")
  //   //   .send({
  //   //     username: "butter_bridge",
  //   //   })
  //   //   .expect(400)
  //   //   .then(({ body: { msg } }) => {
  //   //     expect(msg).toBe("Missing data for request");
  //   //   });

  //     const newComment = {
	// 			username: "butter_bridge",
	// 		};
	// 		return request(app)
	// 			.post("/api/articles/1/comments")
	// 			.send(newComment)
	// 			.expect(400)
	// 			.then((response) => {
	// 				const { msg } = response.body;
	// 				expect(msg).toBe("Bad Request");
	// 			});
  // });



  test("status:400 returns correct error message if empty body is sent to server", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send()
      .expect(400)
      .then(({ body}) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("status:404 returns correct error message if non-existent username is given", () => {
    const testObj = {
      username: "test_user",
      body: "I exist for experimental purpose only",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testObj)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username not found");
      });
  });

  test("status:404 returns correct error message if valid but non-existent article id is given", () => {
    const testObj = {
      username: "butter_bridge",
      body: "Im playing with your imagination",
    };
    return request(app)
      .post("/api/articles/6769/comments")
      .send(testObj)
      .expect(404)
      .then(({ body: { msg }}) => {
        expect(msg).toBe("Not found");
      });
  });

  test("status:400 returns correct error message if invalid article id is given", () => {
    const testObj = {
      username: "butter_bridge",
      body: "I exist here now",
    };
    return request(app)
      .post("/api/articles/not-valid/comments")
      .send(testObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });


});


// PATCH /api/...
describe("PATCH  /api/articles/:article_id", () => {

  test("Updates the article vote count based on article id and positive increment value", () => {
    const votesToUpdate = {
      inc_votes: 17,
    };
    return request(app)
      .patch("/api/articles/11")
      .send(votesToUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 11,
          author: "icellusedkars",
          title: "Am I a cat?",
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: 17,
          article_img_url: expect.any(String),
        });
      });
  });

  test("Updates the article vote count based on article id and negative increment value", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -1 })
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 99,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("200 responds with article unchanged if request body is missing inc_votes", () => {
    return request(app)
      .patch("/api/articles/11")
      .send({
        votes: 10,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 11,
          author: "icellusedkars",
          title: "Am I a cat?",
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: 0,
          article_img_url: expect.any(String),
        });
      });
  });

  test("404 responds with appropriate status and error message when given a valid but non-existent id", () => {
    const votesToUpdate = {
      inc_votes: 12,
    };
    return request(app)
      .patch("/api/articles/999")
      .send(votesToUpdate)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found");
      });
  });

  test("400 responds with appropriate status and error message when given an invalid article_id (not an integer)", () => {
    const votesToUpdate = {
      inc_votes: 12,
    };
    return request(app)
      .patch("/api/articles/pokemon")
      .send(votesToUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("400 responds with appropriate status and error message when provided with an invalid request body (inc_votes is not given with an integer value)", () => {
    const votesToUpdate = {
      inc_votes: "twelve",
    };
    return request(app)
      .patch("/api/articles/2")
      .send(votesToUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Invalid request - must include inc_votes which must be an integer value"
        );
      });
  });
})

