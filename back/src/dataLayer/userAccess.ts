const AWSXRay = require('aws-xray-sdk-core');
const XAWS = AWSXRay.captureAWS(require('aws-sdk'));
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { User } from '../models/User'
import * as uuid from 'uuid'
import * as AWS  from 'aws-sdk'

const bucketName = process.env.USER_IMAGES_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })

export class UserAccess {
 
    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly sisUsers = process.env.SIS_USERS
      ) {
    }

    async addUser(userId: string, username: string, email: string): Promise<User> {
        const newUser = { userId, username, email }
        console.log("user INFO", userId, username, email)
        try {
            await this.docClient.put({
               TableName: this.sisUsers,
               Item: {
                 PK: userId,
                 SK: email,
                 userName: username
                }
            },
           ).promise()

        let addedUser  = {
             ...newUser 
        }
            return addedUser 
        } catch (e) {
          console.log("ERROR adding in ACCESS", e)
          throw Error(e.message)
        }
       }

      async getUser(userId: string, email: string) {
        //will look at users DB and return true if user exists - false if not
        try {
          const result = await this.docClient.get({
            TableName: this.sisUsers,
            Key: {
              PK: userId,
              SK: email
            }
          })
          .promise()
        if(result.Item) {
          return true
        } else {
          return false
        }
        
        } catch (e) {
          throw Error(e.message)
        }
       
      }

    async getUploadUrl() {
        const imageId = uuid.v4()
        return s3.getSignedUrl('putObject', {
          Bucket: bucketName,
          Key: imageId,
          Expires: Number(urlExpiration)
        })
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

  