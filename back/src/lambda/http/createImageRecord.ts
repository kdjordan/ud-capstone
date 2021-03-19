import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createImageRecord } from '../../businessLogic/images'
// import { getUploadUrl } from '../../dataLayer/userAccess'
// import { ImageAccess } from '../../dataLayer/imageAccess'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const {description, imageId, userId} = JSON.parse(event.body)

    const result = await createImageRecord(description, imageId, userId)
    console.log(result)

  try {    
    
    // const uploadUrl = await getUploadUrl()

    // console.log('Upload URL is: ', uploadUrl)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true

      },
      body: JSON.stringify({items: result})
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





