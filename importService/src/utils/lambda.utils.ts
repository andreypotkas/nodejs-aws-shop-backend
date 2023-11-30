export class LambdaUtils {
  static buildResponse(statusCode: number, body: unknown) {
    return {
      statusCode: statusCode,
      headers: {
        "Access-Control-Allow-Credentials": false,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(body),
    };
  }

  static checkBodyParameters(
    requiredParameters: any[],
    data: { [x: string]: any }
  ) {
    return requiredParameters.every((parameter) => {
      const parameterValue = data[parameter];

      if (parameterValue === undefined) {
        return false;
      }

      return true;
    });
  }
}
