import { describe, expect, test } from "@jest/globals";
import { handler } from "./importProductsFile";

describe("Lambda Function get product list", () => {
  test("should return a 200 response with the product list", async () => {
    const result = await handler({});

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual([]);
  });
});
