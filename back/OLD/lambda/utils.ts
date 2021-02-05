import { APIGatewayProxyEvent } from "aws-lambda";
import { parseDealerId } from "../auth/utils";

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getTheDealerId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseDealerId(jwtToken)
}