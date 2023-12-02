import * as cdk from "aws-cdk-lib";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3notifications from "aws-cdk-lib/aws-s3-notifications";
import { CorsHttpMethod, HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { HttpMethod } from "aws-cdk-lib/aws-events";

const app = new cdk.App();

const stack = new cdk.Stack(app, "AndreyPotkasImportServiceStack", {
  env: { region: "eu-west-1" },
});

const bucket = s3.Bucket.fromBucketName(
  stack,
  "ImportBucket",
  "andreypotkas-import-products"
);

const sharedlambdaProps: Partial<NodejsFunctionProps> = {
  runtime: lambda.Runtime.NODEJS_18_X,
  environment: {
    PRODUCT_AWS_REGION: "eu-west-1",
  },
};

const importProductsFile = new NodejsFunction(
  stack,
  "ImportProductsFileLambda",
  {
    ...sharedlambdaProps,
    functionName: "importProductsFile",
    entry: "src/lambdas/importProductsFile/importProductsFile.ts",
  }
);
bucket.grantReadWrite(importProductsFile);

const importFileParser = new NodejsFunction(stack, "ImportFileParserLambda", {
  ...sharedlambdaProps,
  functionName: "importFileParser",
  entry: "src/lambdas/importFileParser/importFileParser.ts",
});

bucket.addEventNotification(
  s3.EventType.OBJECT_CREATED,
  new s3notifications.LambdaDestination(importFileParser)
);

const api = new HttpApi(stack, "ImportApi", {
  corsPreflight: {
    allowHeaders: ["*"],
    allowOrigins: ["*"],
    allowMethods: [CorsHttpMethod.ANY],
  },
});

api.addRoutes({
  integration: new HttpLambdaIntegration(
    "ImportProductsFileIntegration",
    importProductsFile
  ),
  path: "/import",
  methods: [HttpMethod.GET],
});
