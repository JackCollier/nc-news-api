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
  test("should respond with a 400 status when passed a string", () => {
    return request(app)
      .get("/api/articles/notanid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("should respond with 200 status", () => {
    return request(app).get("/api/articles").expect(200);
  });
  test("should respond with an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(body).toHaveProperty("articles", expect.any(Array));
      });
  });
  test("array should contain object with correct properties", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const { articles } = body;
        expect(body).toHaveProperty("articles", expect.any(Array));
        expect(typeof articles).toBe("object");
        articles.forEach((article) => {
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).not.toHaveProperty("body");
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(String));
        });
        expect(articles.length).toEqual(13);
      });
  });
  test("should be ordered by date descending", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("should return 200 status", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });
  test("should respond with an array attached to the key of comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        expect(body).toHaveProperty("comments", expect.any(Array));
      });
  });
  test("should respond with an array of comments containing objects with the correct properties and right length", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toEqual(11);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("created_at", expect.any(String));
        });
      });
  });
  test("should respond with an empty array if article exists but has no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toEqual(0);
      });
  });
  test("should be ordered by created_at ascending", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at");
      });
  });
  test("should respond with a 404 status when passed an id which doesn't exist", () => {
    return request(app)
      .get("/api/articles/123/comments")
      .expect(404)
      .then((body) => {
        expect(body.error.text).toBe("Resource not found");
      });
  });
  test("should respond with a 400 status when passed a string", () => {
    return request(app)
      .get("/api/articles/notanid/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("should respond with a 200 status", () => {
    const patch = { inc_votes: 1 };
    return request(app).patch("/api/articles/1").send(patch).expect(200);
  });
  test("should respond with the article votes updated by 1", () => {
    const patch = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(patch)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty("votes", 101);
      });
  });
  test("should respond with the article votes updated by -1", () => {
    const patch = { inc_votes: -1 };
    return request(app)
      .patch("/api/articles/1")
      .send(patch)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty("votes", 99);
      });
  });
  test("should respond with a 400 when passed an invalid id", () => {
    const patch = { inc_votes: -1 };
    return request(app).patch("/api/articles/notanid").send(patch).expect(400);
  });
  test("should respond with a 404 when passed a valid id but no resource found", () => {
    const patch = { inc_votes: -1 };
    return request(app).patch("/api/articles/1234").send(patch).expect(404);
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
