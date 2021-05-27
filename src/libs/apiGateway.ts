import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";
import isEmpty from 'lodash/isEmpty';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

interface IResponse {
  response: Record<string, unknown> | string;
  statusCode?: number;
  headers?: Record<string, unknown>;
}

export const formatJSONResponse = ({ headers, statusCode, response }: IResponse) => {
  headers = isEmpty(headers) ? {} : headers;

  return {
    statusCode: statusCode || 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      ...headers,
    },
    body: typeof response === 'string' ? response : JSON.stringify(response),
  }
}
