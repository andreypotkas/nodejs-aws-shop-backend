import { LambdaUtils } from "@/utils/lambda.utils";
import { LambdaEvent } from "@/types/lambda.type";
import { S3 } from "aws-sdk";

export const handler = async (event: LambdaEvent) => {
  try {
    console.log("call importProductFile", event);

    const fileName = event.queryStringParameters?.name;

    if (!fileName) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing file name in the query parameters",
        }),
      };
    }

    const s3Key = `uploaded/${fileName}`;

    const s3 = new S3();
    const params = {
      Bucket: "andreypotkas-import-products",
      Key: s3Key,
      ContentType: "text/csv",
    };
    const signedUrl = await s3.getSignedUrlPromise("putObject", params);

    return LambdaUtils.buildResponse(200, signedUrl);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error:", error.message);
    return LambdaUtils.buildResponse(500, {
      message: "Internal Server Error",
    });
  }
};
