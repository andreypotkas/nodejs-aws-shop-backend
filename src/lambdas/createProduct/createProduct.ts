import { DynamoDB } from "aws-sdk";
import { LambdaUtils } from "@/utils/lambda.utils";
import { v4 as uuidv4 } from "uuid";
import { LambdaEvent } from "@/types/lambda.type";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: LambdaEvent) => {
  try {
    console.log("call createProduct", event);

    if (!event.body) {
      return LambdaUtils.buildResponse(400, {
        message: "Request body is missing.",
      });
    }

    const requestBody = JSON.parse(event.body);

    if (
      !requestBody.title ||
      !requestBody.description ||
      !requestBody.price ||
      !requestBody.count
    ) {
      return LambdaUtils.buildResponse(400, {
        message: "Title, description, count, and price are required fields.",
      });
    }

    const productId = uuidv4();

    const productParams = {
      TableName: "Products",
      Item: {
        id: productId,
        title: requestBody.title,
        description: requestBody.description || null,
        price: requestBody.price,
      },
    };

    const stockParams = {
      TableName: "Stocks",
      Item: {
        product_id: productId,
        count: requestBody.count || 0,
      },
    };

    await dynamoDb
      .transactWrite({
        TransactItems: [
          {
            Put: productParams,
          },
          {
            Put: stockParams,
          },
        ],
      })
      .promise();

    const response = {
      message: "Product created successfully.",
      productId,
    };

    return LambdaUtils.buildResponse(201, response);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error:", error.message);
    return LambdaUtils.buildResponse(500, {
      message: "Internal Server Error",
    });
  }
};
