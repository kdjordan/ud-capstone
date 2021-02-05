import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { checkDealerExists } from '../../businessLogic/profile'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event.headers.Authorization)
    console.log(event)
  try {
    //get admin ID from event
    
    console.log('in CDE', event.pathParameters.adminId)
    let dealerExists = await checkDealerExists(event.pathParameters.adminId)
    console.log('dealerExists', dealerExists)
    // if(!dealerExists) {
    //   addDealer = true
    // }

    //check if admin matches shop adminId

    //get the profile
    // let profile = await getProfile(dealerId)


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
      body: JSON.stringify({data: dealerExists})
    }
   
  } catch (e) {
      console.log("ERROR in checkDealerExists", e);
      
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


