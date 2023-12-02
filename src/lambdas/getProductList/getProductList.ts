import { DynamoDB } from "aws-sdk";
import { LambdaUtils } from "@/utils/lambda.utils";
import { LambdaEvent } from "@/types/lambda.type";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler = async (event: LambdaEvent) => {
  try {
    console.log("call getProductListWithStock", event);

    const params = {
      TableName: "Products",
    };

    const productResult = await dynamoDb.scan(params).promise();
    const products = productResult.Items ?? [];

    const productListWithStock = await Promise.all(
      products.map(async (product) => {
        const stockParams = {
          TableName: "Stocks",
          KeyConditionExpression: "product_id = :pid",
          ExpressionAttributeValues: {
            ":pid": product.id,
          },
        };

        const stockResult = await dynamoDb.query(stockParams).promise();
        const stock = stockResult.Items ? stockResult.Items[0] : { count: 0 };

        return {
          ...product,
          count: stock.count,
        };
      })
    );

    return LambdaUtils.buildResponse(200, productListWithStock);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error:", error.message);
    return LambdaUtils.buildResponse(500, {
      message: "Internal Server Error",
    });
  }
};
