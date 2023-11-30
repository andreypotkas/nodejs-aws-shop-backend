import { LambdaUtils } from "@/utils/lambda.utils";
import { S3Event } from "@/types/s3event.type";
import * as stream from "stream";
import * as csvParser from "csv-parser";
import * as AWS from "aws-sdk";

const s3 = new AWS.S3();

export const handler = async (event: S3Event) => {
  try {
    console.log("call importFileParser", event);

    const s3Record = event.Records[0].s3;
    const bucket = s3Record.bucket.name;
    const key = decodeURIComponent(s3Record.object.key.replace(/\+/g, " "));

    if (!key.startsWith("uploaded/")) {
      console.log(`Ignoring file: ${key}`);
      return;
    }

    const s3Stream = new stream.PassThrough();
    const s3GetObjectParams = { Bucket: bucket, Key: key };
    const s3Object = await s3.getObject(s3GetObjectParams).promise();
    s3Stream.end(s3Object.Body);

    s3Stream
      .pipe(csvParser())
      .on("data", (record) => {
        console.log("Parsed record:", JSON.stringify(record));
      })
      .on("end", () => {
        console.log("CSV parsing completed.");
      });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "File processing initiated" }),
    };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error:", error.message);
    return LambdaUtils.buildResponse(500, {
      message: "Internal Server Error",
    });
  }
};
