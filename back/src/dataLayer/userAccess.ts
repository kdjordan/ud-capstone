const AWSXRay = require('aws-xray-sdk-core');
const XAWS = AWSXRay.captureAWS(require('aws-sdk'));
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { User } from '../models/User'

export class UserAccess {
 
    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly userTable = process.env.USER_TABLE
      ) {
    }

    async addUser(userId: string, username: string, email: string): Promise<User> {
        const newUser = { userId, username, email }
        try {
            await this.docClient.put({
               TableName: this.userTable,
               Item: newUser
           }).promise()

        let addedUser  = {
             ...newUser 
        }
            return addedUser 
        } catch (e) {
            console.log("ERROR getting groups in ACCESS", e)
        }
       }

    async checkUser(userId: string): Promise<Boolean> {
        try {
            const result = await this.docClient.query({
               TableName: this.userTable,
               KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: { ':userId': userId }
           }).promise()

        if(result.Items.length == 0) { return false } 
        else { return true }

        } catch (e) {
            console.log("ERROR getting groups in ACCESS", e)
        }
    }

}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8080'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }