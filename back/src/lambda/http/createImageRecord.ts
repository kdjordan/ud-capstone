import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

// import { createImage } from '../../businessLogic/user'
// import { getUploadUrl } from '../../dataLayer/userAccess'
import { GroupAccess } from '../../dataLayer/imageAccess'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const groupAccess = new GroupAccess()

    const {description, imageId, userId, groupId} = JSON.parse(event.body)

    const result = groupAccess.createImageRecord(description, imageId, userId, groupId)
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





