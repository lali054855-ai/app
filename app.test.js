import request from "supertest";
import app from "./app.js";

describe("RecipeVault health endpoints", () => {
  test("GET /health returns status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  test("GET /api/health identifies the application", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      application: "RecipeVault",
    });
  });
});
