const request = require("supertest")
const seed = require("../db/seeds/seed.js")
const app = require("../app.js")
const db = require("../db/connection.js");
const data = require("../db/data/test-data");
const endPoints = require("../endpoints.json");

beforeEach(() =>  seed(data));
  
afterAll(() => db.end());
  

describe('GET api/topics', () => {
    test('should return an array of topics each with a slug and description property', () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const { topics } = response.body; 
          console.log(topics)
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
      .then(({body}) => {
        expect(body).toEqual(endPoints)
        //console.log(endPoints)
      })
  })
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