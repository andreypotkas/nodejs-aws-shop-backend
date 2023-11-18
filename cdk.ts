import * as cdk from "aws-cdk-lib";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";

import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

const app = new cdk.App();

const stack = new cdk.Stack(app, "AndreyPotkasProductServiceStack", {
  env: { region: "eu-west-1" },
});

const sharedlambdaProps: Partial<NodejsFunctionProps> = {
  runtime: lambda.Runtime.NODEJS_18_X,
  environment: {
    PRODUCT_AWS_REGION: "eu-west-1",
  },
};

const getProductList = new NodejsFunction(stack, "GetProductListLambda", {
  ...sharedlambdaProps,
  functionName: "getProductList",
  entry: "src/lambdas/getProductList/getProductList.ts",
});

const getProductById = new NodejsFunction(stack, "GetProductByIdLambda", {
  ...sharedlambdaProps,
  functionName: "getProductById",
  entry: "src/lambdas/getProductById/getProductById.ts",
});

const api = new HttpApi(stack, "ProductApi", {
  corsPreflight: {
    allowHeaders: ["*"],
    allowOrigins: ["*"],
  },
});

api.addRoutes({
  integration: new HttpLambdaIntegration(
    "GetProductListIntegration",
    getProductList
  ),
  path: "/products",
  methods: [HttpMethod.GET],
});

api.addRoutes({
  integration: new HttpLambdaIntegration(
    "GetProductIntegration",
    getProductById
  ),
  path: "/products/{id}",
  methods: [HttpMethod.GET],
});
