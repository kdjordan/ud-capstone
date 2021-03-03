import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

// import { createImage } from '../../businessLogic/user'
// import { getUploadUrl } from '../../dataLayer/userAccess'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const body = JSON.parse(event.body);
    console.log(body)

  try {    
    
    // const uploadUrl = await getUploadUrl()

    // console.log('Upload URL is: ', uploadUrl)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true

      },
      body: JSON.stringify({items: true})
    }
   
  } catch (e) {
      console.log("ERROR adding image in Lambda", e);
      
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



