import { dataArray } from "@/data/data";
import { LambdaUtils } from "@/utils/lambda.utils";

type LambdaEvent = {
  pathParameters: { id: string };
};

export const handler = async (event: LambdaEvent) => {
  try {
    console.log("call getProductById");

    const product = dataArray.find(
      (item) => item.id === event.pathParameters.id
    );

    return product
      ? LambdaUtils.buildResponse(200, { product })
      : LambdaUtils.buildResponse(404, {
          message: "There is no such product.",
        });
  } catch (err: unknown) {
    return LambdaUtils.buildResponse(500, {
      message: "Internal Server Error",
    });
  }
};
