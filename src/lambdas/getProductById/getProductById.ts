import { DynamoDB } from "aws-sdk";
import { LambdaUtils } from "@/utils/lambda.utils";
import { LambdaEvent } from "@/types/lambda.type";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: LambdaEvent) => {
  try {
    console.log("call getProductById", event);

    const getProductParams = {
      TableName: "Products",
      Key: {
        id: event.pathParameters?.id,
      },
    };

    const productResult = await dynamoDb.get(getProductParams).promise();
    const product = productResult.Item;

    if (!product) {
      return LambdaUtils.buildResponse(404, {
        message: "There is no such product.",
      });
    }

    const getStockParams = {
      TableName: "Stocks",
      Key: {
        product_id: product.id,
      },
    };

    const stockResult = await dynamoDb.get(getStockParams).promise();
    const stock = stockResult.Item ? stockResult.Item : { count: 0 };

    const response = {
      ...product,
      count: stock.count,
    };

    return LambdaUtils.buildResponse(200, response);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error:", error.message);
    return LambdaUtils.buildResponse(500, {
      message: "Internal Server Error",
    });
  }
};
