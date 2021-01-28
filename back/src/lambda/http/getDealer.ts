import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

// import { getAllTodos, checkUserExists, addUser } from '../../businessLogic/profile'
import { getDealer, getDealerId } from '../../businessLogic/profile'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event.headers.Authorization)
    console.log(event)
  try {
    //get admin ID from event
    let dealerId = await getDealerId(event)

    //check if admin matches shop adminId

    //get the profile
    let profile = await getDealer(dealerId)


    // check to see if user exists in Users table
    // let theUser = await checkUserExists(event)
    
    // const profile = await docClient.query({
    //     TableName: profileTable,
    //     KeyConditionExpression: 'dealerId = :dealerId',
    //     ExpressionAttributeValues: {
    //         ':dealerId': '111'
    //     }
    // }).promise()
    // if so, get any todos they have
    // if (theUser.count !== 0) {
    //   todos = await getAllTodos(theUser.id)
    // } else {
    //   //add User to Users Table
    //   await addUser(theUser.id)
    // }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true

      },
      body: JSON.stringify({profile})
    }
   
  } catch (e) {
      console.log("ERROR in getTodos", e);
      
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


