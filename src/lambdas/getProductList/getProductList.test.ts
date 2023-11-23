import { describe, expect, test, jest } from "@jest/globals";
import { handler } from "./getProductList";
import { dataArray } from "@/data/data";

describe("Lambda Function get product list", () => {
  test("should return a 200 response with the product list", async () => {
    const result = await handler();

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(dataArray);
  });
});
