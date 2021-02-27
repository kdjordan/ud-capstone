import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

// import { putImage } from '../../businessLogic/user'
import { checkGroup } from '../../businessLogic/groups'

// const bucketName = process.env.USER_IMAGES_BUCKET
// const urlExpiration = process.env.SIGNED_URL_EXPIRATION


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const body = JSON.parse(event.body);
    console.log(body)
  try {    
    //make sure group exists
    // console.log("Group Tyep ?:", typeof(body.groupId))
    let groupExists = await checkGroup(body.groupId.toString())
    console.log("Group Exists ?:", groupExists)

    if(groupExists) {
      console.log("The group is there")
      //upload image and add image id to appropriate group images array
    } else {
      console.log("The group needs to be added")
      //add new group
      //upload image and add image id to appropriate group images array
    }

    // let result = await putImage(body.theImage)

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


