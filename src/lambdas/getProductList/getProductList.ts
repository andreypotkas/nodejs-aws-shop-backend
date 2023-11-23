import { dataArray } from "@/data/data";
import { LambdaUtils } from "@/utils/lambda.utils";

export const handler = async () => {
  try {
    console.log("call getProductList");

    return LambdaUtils.buildResponse(200, dataArray);
  } catch (err: unknown) {
    const error = err as Error;
    return LambdaUtils.buildResponse(500, {
      message: error.message,
    });
  }
};
