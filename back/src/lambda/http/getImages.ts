import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { getImage } from '../../businessLogic/images'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const userId = event.pathParameters.userId
    
  try {
    let images = await getImage(userId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true

      },
      body: JSON.stringify({images})
    }
   
  } catch (e) {
      console.log("ERROR getting Groups in getGroups Lambda", e);
      
      return {
        statusCode: 502,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({error: `${e}`})
      }
      
  }
}


