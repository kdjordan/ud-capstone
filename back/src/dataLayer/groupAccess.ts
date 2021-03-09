const AWSXRay = require('aws-xray-sdk-core');
const XAWS = AWSXRay.captureAWS(require('aws-sdk'));
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { Group } from '../models/Group'
// import { ImageRecord } from '../models/ImageRecord'

export class GroupAccess {
 
    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly groupsTable = process.env.GROUPS_TABLE,
      private readonly imagesBucket = process.env.USER_IMAGES_BUCKET

      ) {
    }

    async getGroups(): Promise<Group[]> {
        try {
            let groups = await this.docClient.scan({
               TableName: this.groupsTable,
           }).promise()
        //    console.log(groups)
            const items = groups.Items
            return items as Group[]
        } catch (e) {
            return e
        }
       }

    async addGroup(groupId: string, description: string, groupUrl: string): Promise<Group> {
      const newGroup = { groupId, description, groupUrl }
        try {
          await this.docClient.put({
            TableName: this.groupsTable,
            Item: newGroup
          }).promise()
        
          let addedGroup = { ...newGroup }
            
          return addedGroup
        } catch (e) {
            return e
        }
       }

       async checkGroup(groupId: string) {
        const result = await this.docClient.get({
            TableName: this.groupsTable,
            Key: {
              groupId
            }
          })
          .promise()
      
        console.log('Get group: ', result)
        return !!result.Item
      }

       async createImageRecord(description: string, imageId: string, userId: string, groupId: string, createdAt: string) {
         const attachmentUrl = createAttachmentUrl(this.imagesBucket, imageId)
         console.log('calling checkGroup in: ', description, imageId, userId, groupId)

         try {
           const result = await this.docClient.update({
               TableName: this.groupsTable,
               Key: {
                 groupId
               },
               UpdateExpression: "set #theImages = {imageUrl :iurl, owner: :uid, description: :desc, createdAt: :added",
               ExpressionAttributeNames: {
                 ":iurl": attachmentUrl,
                 ":uid": userId,
                 ":desc": description,
                 ":added": createdAt
               },
               ReturnValues: "UPDATED_NEW"
             })
             .promise()

             return result

         } catch(e) {
            return e 
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

  function createAttachmentUrl(bucketName: string, imageId: string): string {
    return `https://${bucketName}.s3.amazonaws.com/${imageId}`
  }