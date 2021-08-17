const request = require("supertest");
const flips = require("../src/data/flips-data");
const app = require("../src/app");

describe("path /flips", () => {
  beforeEach(() => {
    flips.splice(0, flips.length);
  });
  describe("GET method", () => {
    test("returns an array of flips", async () => {
      const expected = [
        { id: 1, result: "heads" },
        { id: 2, result: "heads" },
        { id: 3, result: "tails" },
      ];

      flips.push(...expected);

      const response = await request(app).get("/flips");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(expected);
    });
  });
  describe("POST method", () => {
    test("creates a new flip and assigns id", async () => {
      const response = await request(app)
        .post("/flips")
        .set("Accept", "application/json")
        .send({ data: { result: "tails" } });

      expect(response.status).toBe(201);
      expect(response.body.data.id).toBe(4);
      expect(response.body.data.result).toBe("tails");
    });

    test("returns 400 if result is missing", async () => {
      const response = await request(app)
        .post("/flips")
        .set("Accept", "application/json")
        .send({ data: { message: "returns 400 if result is missing" } });

      expect(response.status).toBe(400);
    });

    test("returns 400 if result is empty", async () => {
      const response = await request(app)
        .post("/flips")
        .set("Accept", "application/json")
        .send({ data: { result: "" } });

      expect(response.status).toBe(400);
    });
  });
});
