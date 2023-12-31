const app = require("../app");
const request = require("supertest");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const jsonEndpoint = require("../endpoints.json");
const articles = require("../db/data/test-data/articles");

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
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: "11",
        });
      });
  });
  test("if oject has no comments, comment_count should be set to 0", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(body).toHaveProperty("article", expect.any(Object));
        expect(article).toEqual({
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: "0",
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
        expect(body.articles).toHaveProperty("articles", expect.any(Array));
      });
  });
  test("array should contain object with correct properties", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const { articles } = body;
        expect(body.articles).toHaveProperty("articles", expect.any(Array));
        expect(typeof articles).toBe("object");
        articles.articles.forEach((article) => {
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).not.toHaveProperty("body");
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("comment_count", expect.any(String));
        });
        // expect(articles.length).toEqual(13);
      });
  });
  test("should be ordered by date descending default", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("should be filtered by topic mitch", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.articles).toBeSortedBy("topic");
        // expect(articles.length).toEqual(12);
        articles.articles.forEach((article) => {
          expect(article).toHaveProperty("topic", "mitch");
        });
      });
  });
  test("should return an empty array if valid topic but no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.articles.length).toEqual(0);
      });
  });
  test("should return 404 status when passed no existant topic", () => {
    return request(app).get("/api/articles?topic=dogfood").expect(404);
  });
  test("should return 400 status when passed an invalid topic", () => {
    return request(app).get("/api/articles?topic=1223").expect(404);
  });
  test("should be sorted by title", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("should return 400 status when passed a non existant sort_by", () => {
    return request(app).get("/api/articles?sort_by=jeff").expect(400);
  });
  test("should be ordered in ascending", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.articles).toBeSortedBy("created_at", {
          descending: false,
        });
      });
  });
  test("should return 400 status when passed a bad order", () => {
    return request(app).get("/api/articles?order=up").expect(400);
  });
  test("should return 5 articles per page", () => {
    return request(app)
      .get("/api/articles?page=2&limit=5")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.articles.length).toEqual(5);
      });
  });
  test("should return 3 articles per page and by filtered by topic mitch", () => {
    return request(app)
      .get("/api/articles?topic=mitch&page=1&limit=3")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.articles.length).toEqual(3);
      });
  });
  test("should return articles with a total_count property", () => {
    return request(app)
      .get("/api/articles?topic=mitch&page=1&limit=5")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveProperty("total_count", 12);
      });
  });
  test("should return articles with a total_count property", () => {
    return request(app)
      .get("/api/articles?topic=cats&page=1&limit=5")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveProperty("total_count", 1);
      });
  });
  test("should return a 400 status if passed an invalid limit", () => {
    return request(app).get("/api/articles?&page=1&limit=abc").expect(400);
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("should respond with a 201 status", () => {
    const testComment = {
      username: "icellusedkars",
      body: "Northcoders Bootcamp",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(201);
  });
  test("should respond with the posted comment", () => {
    const testComment = {
      username: "icellusedkars",
      body: "Northcoders Bootcamp",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toHaveProperty("comment_id", 19);
        expect(comment).toHaveProperty("body", "Northcoders Bootcamp");
        expect(comment).toHaveProperty("article_id", 1);
        expect(comment).toHaveProperty("author", "icellusedkars");
        expect(comment).toHaveProperty("votes", 0);
        expect(comment).toHaveProperty("created_at", expect.any(String));
      });
  });
  test("should respond with a 400 status when passed the wrong data type for id", () => {
    return request(app).post("/api/articles/stringy/comments").expect(400);
  });
  test("should respond with a 404 status when passed a nonexistent username", () => {
    const testComment = {
      username: "fakeusername",
      body: "Northcoders Bootcamp",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(404);
  });
  test("should respond with a 400 status when passed no body", () => {
    const testComment = {
      username: "icel",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(400);
  });
  test("should respond with a 404 status when passed an id which is valid but doesn't exist", () => {
    const testComment = {
      username: "fakeusername",
      body: "Northcoders Bootcamp",
    };
    return request(app)
      .post("/api/articles/1232/comments")
      .send(testComment)
      .expect(404);
  });
});

describe("POST /api/topics", () => {
  test("should return a 201 status", () => {
    const post = {
      slug: "blackberries",
      description: "best berry",
    };
    return request(app).post("/api/topics").send(post).expect(201);
  });
  test("should return the new topic", () => {
    const post = {
      slug: "blackberries",
      description: "best berry",
    };
    return request(app)
      .post("/api/topics")
      .send(post)
      .then(({ body }) => {
        const { topic } = body;
        expect(topic).toEqual({
          slug: "blackberries",
          description: "best berry",
        });
      });
  });
  test("should respond with a 400 status when passed no body", () => {
    return request(app).post("/api/topics").expect(400);
  });
  test("should respond with a 400 status when passed an invalid body", () => {
    const post = {
      name: "blackberries",
      description: "best berry",
    };
    return request(app).post("/api/topics").send(post).expect(400);
  });
});

describe("POST /api/articles", () => {
  test("should respond with a 201 status", () => {
    const post = {
      author: "lurker",
      title: "cats matter",
      body: "There can never be enough cats",
      topic: "cats",
      article_img_url:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1443&q=80",
    };
    return request(app).post("/api/articles").send(post).expect(201);
  });
  test("should respond with the new article in correct foramt", () => {
    const post = {
      author: "lurker",
      title: "cats matter",
      body: "There can never be enough cats",
      topic: "cats",
      article_img_url:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1443&q=80",
    };
    return request(app)
      .post("/api/articles")
      .send(post)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("article_id", 14);
        expect(article).toHaveProperty("author", "lurker");
        expect(article).toHaveProperty("topic", "cats");
        expect(article).toHaveProperty(
          "body",
          "There can never be enough cats"
        );
        expect(article).toHaveProperty("title", "cats matter");
        expect(article).toHaveProperty("votes", 0);
        expect(article).toHaveProperty("created_at", expect.any(String));
      });
  });
  test("should respond with the new article in correct foramt", () => {
    const post = {
      author: "lurker",
      title: "cats matter",
      body: "There can never be enough cats",
      topic: "cats",
      article_img_url:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1443&q=80",
    };
    return request(app)
      .post("/api/articles")
      .send(post)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("article_id", 14);
        expect(article).toHaveProperty("author", "lurker");
        expect(article).toHaveProperty("topic", "cats");
        expect(article).toHaveProperty(
          "body",
          "There can never be enough cats"
        );
        expect(article).toHaveProperty("title", "cats matter");
        expect(article).toHaveProperty("votes", 0);
        expect(article).toHaveProperty("created_at", expect.any(String));
      });
  });
  test("should respond with a 404 status if author currently doesn't exist", () => {
    const post = {
      author: "iAmNotAnAuthor",
      title: "cats matter",
      body: "There can never be enough cats",
      topic: "cats",
      article_img_url:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1443&q=80",
    };
    return request(app).post("/api/articles").send(post).expect(404);
  });
  test("should respond with a 404 status if topic currently doesn't exist", () => {
    const post = {
      author: "lurker",
      title: "cats matter",
      body: "There can never be enough cats",
      topic: "cheese",
      article_img_url:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1443&q=80",
    };
    return request(app).post("/api/articles").send(post).expect(404);
  });
  test("should still respond with a 201 status when passed no img", () => {
    const post = {
      author: "lurker",
      title: "cats matter",
      body: "There can never be enough cats",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(post)
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("article_img_url");
      });
  });
  test("should respond with a 400 status with invalid request data", () => {
    const post = {
      author: 123,
      title: "cats matter",
      body: "There can never be enough cats",
      topic: "cheese",
      article_img_url:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1443&q=80",
    };
    return request(app).post("/api/articles").send(post).expect(404);
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
  test("should respond with a 400 when passed an invalid body value", () => {
    const patch = { inc_votes: "abc" };
    return request(app).patch("/api/articles/notanid").send(patch).expect(400);
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("should return a 200 status", () => {
    const patch = { inc_votes: 1 };
    return request(app).patch("/api/comments/1").send(patch).expect(200);
  });
  test("should return the comment with votes updated correctly", () => {
    const patch = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/1")
      .send(patch)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          article_id: 9,
          author: "butter_bridge",
          votes: 17,
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  });
  test("should return a 400 status when passed an invalid id", () => {
    const patch = { inc_votes: 1 };
    return request(app).patch("/api/comments/notanid").send(patch).expect(400);
  });
  test("should return a 404 status when passed a valid id which doesn't exist", () => {
    const patch = { inc_votes: 1 };
    return request(app).patch("/api/comments/1234").send(patch).expect(404);
  });
  test("should return a 400 status when passed an invalid body value", () => {
    const patch = { inc_votes: "abc" };
    return request(app).patch("/api/comments/1234").send(patch).expect(400);
  });
});

describe("GET/api/users", () => {
  test("should respond with a 200 status", () => {
    return request(app).get("/api/users").expect(200);
  });
  test("should respond with a an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .then(({ body }) => {
        const { users } = body;
        expect(body).toHaveProperty("users", expect.any(Array));
        expect(users.length).toEqual(4);
        users.forEach((user) => {
          expect(user).toHaveProperty("username", expect.any(String));
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("should respond with a 204 status on valid Id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("should respond with a 404 status on valid Id which doesn't exist", () => {
    return request(app).delete("/api/comments/1231").expect(404);
  });
  test("should respond with a 400 status on invalid Id", () => {
    return request(app).delete("/api/comments/fakeId").expect(400);
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("should return a 204 status on valid id", () => {
    return request(app).delete("/api/articles/2").expect(204);
  });
  test("should respond with a 404 status on valid Id which doesn't exist", () => {
    return request(app).delete("/api/articles/1231").expect(404);
  });
  test("should respond with a 400 status on invalid Id", () => {
    return request(app).delete("/api/articles/fakeId").expect(400);
  });
});

describe("GET /api/users/:username", () => {
  test("should respond with a 200 status", () => {
    return request(app).get("/api/users/lurker").expect(200);
  });
  test("should respond with a the correct user", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual({
          username: "lurker",
          name: "do_nothing",
          avatar_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        });
      });
  });
  test("should respond with a 404 status if username is valid but doesn't exist", () => {
    return request(app).get("/api/users/Christopher").expect(404);
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
