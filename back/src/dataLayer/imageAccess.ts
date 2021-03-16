const AWSXRay = require('aws-xray-sdk-core');
const XAWS = AWSXRay.captureAWS(require('aws-sdk'));
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { Image } from '../models/Image'
// import { ImageRecord } from '../models/ImageRecord'

export class ImageAccess {
 
    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly sisTable = process.env.SIS_TABLE
      ) {
    }

    async getImage(userId: string): Promise<Image[]> {
        try {
            const images = await this.docClient.scan({
               TableName: this.sisTable,
           }).promise()
        //    console.log(iamges)
            const items = images.Items
            return items as Image[]
        } catch (e) {
            return e
        }
       }

    async putImage(description: string, imageId: string, userId: string, createdAt: string): Promise<Image> {
        try {
            const image = await this.docClient.put({
               TableName: this.sisTable,
               Item: {
                PK: `USER#${userId}`,
                SK: `USER#${imageId}`,
                createdAt:  createdAt,
                desciption: description,
               }
           }).promise()
        //    console.log(iamges)
            return image as Image
        } catch (e) {
            return e
        }
       }

    // async addGroup(groupId: string, description: string, groupUrl: string): Promise<Group> {
    //   const newGroup = { groupId, description, groupUrl }
    //     try {
    //       await this.docClient.put({
    //         TableName: this.groupsTable,
    //         Item: newGroup
    //       }).promise()
        
    //       let addedGroup = { ...newGroup }
            
    //       return addedGroup
    //     } catch (e) {
    //         return e
    //     }
    //    }


    //    async createImageRecord(description: string, imageId: string, userId: string, groupId: string, createdAt: string) {
    //      const attachmentUrl = createAttachmentUrl(this.imagesBucket, imageId)
    //      console.log('calling checkGroup in: ', description, imageId, userId, groupId)

    //      try {
    //        const result = await this.docClient.update({
    //            TableName: this.groupsTable,
    //            Key: {
    //              groupId
    //            },
    //            UpdateExpression: "set #theImages = {imageUrl :iurl, owner: :uid, description: :desc, createdAt: :added",
    //            ExpressionAttributeNames: {
    //              ":iurl": attachmentUrl,
    //              ":uid": userId,
    //              ":desc": description,
    //              ":added": createdAt
    //            },
    //            ReturnValues: "UPDATED_NEW"
    //          })
    //          .promise()

    //          return result

    //      } catch(e) {
    //         return e 
    //      }
    //   }
      
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