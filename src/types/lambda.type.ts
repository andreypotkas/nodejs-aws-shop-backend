export interface LambdaEvent {
  body?: string;
  headers?: { [name: string]: string };
  multiValueHeaders?: { [name: string]: string[] };
  httpMethod?: string;
  isBase64Encoded?: boolean;
  path?: string;
  pathParameters?: { [name: string]: string } | null;
  queryStringParameters?: { [name: string]: string } | null;
  multiValueQueryStringParameters?: { [name: string]: string[] } | null;
  stageVariables?: { [name: string]: string } | null;
  requestContext?: {
    accountId?: string;
    resourceId?: string;
    stage?: string;
    requestId?: string;
    identity?: {
      cognitoIdentityPoolId?: string;
      accountId?: string;
      cognitoIdentityId?: string;
      caller?: string;
      apiKey?: string;
      sourceIp?: string;
      cognitoAuthenticationType?: string;
      cognitoAuthenticationProvider?: string;
      userArn?: string;
      userAgent?: string;
      user?: string;
    };
    resourcePath?: string;
    httpMethod?: string;
    apiId?: string;
  };
}
