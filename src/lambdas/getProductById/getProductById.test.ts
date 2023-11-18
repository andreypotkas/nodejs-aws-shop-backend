import { describe, expect, test } from "@jest/globals";

import { handler } from "./getProductById";

describe("Lambda Function get product by id", () => {
  test("should return a product when it exists", async () => {
    const event = {
      pathParameters: { id: "1" },
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBeDefined();
  });

  test("should return a 404 response when the product does not exist", async () => {
    const event = {
      pathParameters: { id: "nonExistingProductId" },
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(404);
    expect(result.body).toBeDefined();
  });
});
