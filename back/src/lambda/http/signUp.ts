import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { checkDealerExists, addProfile } from '../../businessLogic/profile'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // // check to see if user exists in Profile table
    const body = JSON.parse(event.body);
    let profile = await checkDealerExists(body.adminID)
    console.log(profile)
    //if we have a user return
    if(profile) {
      console.log('user exists in profile table')
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
          body: JSON.stringify({items: profile})
      }
    } else {
      //add user to ProfileTable
      console.log('adding user to profile table')
      let user = await addProfile(body.adminID, body.shopName)
      console.log("user after adding to profile table", user);
      
    // }
    // let todos = []

    // // if so, get any todos they have
    // if (theUser.count !== 0) {
    //   todos = await getAllTodos(theUser.id)
    // } else {
    //   //add User to Users Table
    //   await addUser(theUser.id)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
    //   body: JSON.stringify({items: todos})
        body: JSON.stringify({items: user})
    }
    }

   
  } catch (e) {
      console.log("ERROR adding Shop", e);
      
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


