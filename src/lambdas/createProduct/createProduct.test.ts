import { handler } from "./createProduct"; // Import your Lambda function
import { DynamoDB } from "aws-sdk";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";

// Mock DynamoDB DocumentClient
jest.mock("aws-sdk", () => {
  const mDocumentClient = {
    put: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return {
    DocumentClient: jest.fn(() => mDocumentClient),
  };
});

describe("createProduct Lambda function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a product successfully", async () => {
    const mockEvent = {
      body: JSON.stringify({
        title: "Test Product",
        description: "Test Description",
        price: 19.99,
        count: 50,
      }),
    };

    const mockResponse = {
      message: "Product created successfully.",
      productId: "mockProductId",
    };

    (DynamoDB.DocumentClient.prototype.put as jest.Mock).mockImplementationOnce(
      () => ({
        promise: jest.fn().mockResolvedValueOnce({} as never),
      })
    );

    const result = await handler(mockEvent);

    expect(result).toEqual(mockResponse);
    expect(DynamoDB.DocumentClient.prototype.put).toHaveBeenCalledWith({
      TableName: "Products",
      Item: expect.objectContaining({
        id: expect.any(String),
        title: "Test Product",
        description: "Test Description",
        price: 19.99,
      }),
    });

    expect(DynamoDB.DocumentClient.prototype.put).toHaveBeenCalledWith({
      TableName: "Stocks",
      Item: expect.objectContaining({
        product_id: expect.any(String),
        count: 50,
      }),
    });
  });

  it("should handle missing required fields", async () => {
    const mockEvent = {
      body: JSON.stringify({
        // Missing required fields
      }),
    };

    const mockResponse = {
      statusCode: 400,
      body: JSON.stringify({
        message: "Title, description, and price are required fields.",
      }),
    };

    const result = await handler(mockEvent);

    expect(result).toEqual(mockResponse);
    expect(DynamoDB.DocumentClient.prototype.put).not.toHaveBeenCalled();
  });
});
