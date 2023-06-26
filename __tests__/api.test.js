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
