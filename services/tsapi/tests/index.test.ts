import { it, expect } from "vitest";
import request from "supertest";
import app from "../src/index";

it("health ok", async () => {
  const r = await request(app).get("/health");
  expect(r.statusCode).toBe(200);
  expect(r.body.status).toBe("ok");
});

it("hello ok", async () => {
  const r = await request(app).get("/hello").query({ name: "Mint" });
  expect(r.statusCode).toBe(200);
  expect(r.body.message).toBe("Hello, Mint!");
});

it("hello 400", async () => {
  const r = await request(app).get("/hello");
  expect(r.statusCode).toBe(400);
});
