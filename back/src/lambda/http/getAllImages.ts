import 'source-map-support/register'

import { APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { getAllImages } from '../../businessLogic/images'

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
    
  try {
    let images = await getAllImages()

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


