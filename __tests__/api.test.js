const app = require("../app");
const request = require("supertest");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const jsonEndpoint = require("../endpoints.json");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("should respond with a 200 status", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("should respond with an array of topic", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("topics", expect.any(Array));
      });
  });
  test("Array should contain object containing correct properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(body).toHaveProperty("topics", expect.any(Array));
        expect(typeof topics).toBe("object");
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
        expect(topics.length).toEqual(3);
      });
  });
});

describe("GET /api/", () => {
  test("should respond with a 200 status", () => {
    return request(app).get("/api/").expect(200);
  });
  test("should respond with an object matching the jsonEndpoint", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then(({ body }) => {
        expect(jsonEndpoint).toMatchObject(body);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("should respond with a 200 status", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  test("should respond with an object article containing the passed id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(body).toHaveProperty("article", expect.any(Object));
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("should respond with a 404 status when passed an id which doesn't exist", () => {
    return request(app)
      .get("/api/articles/123")
      .expect(404)
      .then((body) => {
        expect(body.error.text).toBe("Article not found");
      });
  });
  test("should respond with a 404 status when passed an id which doesn't exist", () => {
    return request(app)
      .get("/api/articles/notanid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("Error testing", () => {
  test("GET should respond with a 404 status if invalid endpoint", () => {
    return request(app).get("/api/topic").expect(404);
  });
  test("404: when passed wrong type should respond with err msg", () => {
    return request(app)
      .get("/ap/nonsense")
      .expect(404)
      .then((body) => {
        expect(body.res.statusMessage).toBe("Not Found");
      });
  });
});
