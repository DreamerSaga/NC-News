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