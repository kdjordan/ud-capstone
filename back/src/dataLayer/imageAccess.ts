const AWSXRay = require('aws-xray-sdk-core');
const XAWS = AWSXRay.captureAWS(require('aws-sdk'))
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Image } from '../models/Image'

export class ImageAccess {
 
    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly sisImages = process.env.SIS_IMAGES,
      private readonly imagesBucket = process.env.SIS_IMAGES_BUCKET
      ) {
    }

    async getUserImages(userId: string): Promise<Image[]> {
        try {
          const images = await this.docClient.query({
            TableName: this.sisImages,
            KeyConditionExpression: 'PK = :userId',
            ExpressionAttributeValues: {
              ':userId': userId
            },
          }).promise()
          console.log("theImages are ", images)
          return images.Items as Image[]
        } catch (e) {
            throw Error(e.message)
        }

       }
    async deleteUserImage(userId: string, imageId:string): Promise<Boolean> {
      console.log("called delete to DB", userId, imageId)
        try {
          const result = await this.docClient.delete({
            TableName: this.sisImages,
            Key:{
              PK: imageId,
              SK: userId
            }
          }).promise()
          console.log("selete result",result)
          return true
        } catch (e) {
            console.log('Error deleting for the image', e)
            throw Error(e.message)
        }

       }

    async getAllImages(): Promise<Image[]> {
        try {
            const images = await this.docClient.scan({
              TableName: this.sisImages,
           }).promise()
            const items = images.Items
            return items as Image[]
        } catch (e) {
          throw Error(e.message)
        }
       }

       async createImageRecord(description: string, imageId: string, userId: string, owner: string) {
         const attachmentUrl = createAttachmentUrl(this.imagesBucket, imageId)
         const  createdDate = new Date().toISOString()

         try {
           await this.docClient.put({
               TableName: this.sisImages,
               Item: {
                PK: userId,
                SK: imageId,
                description: description,
                imageUrl: attachmentUrl,
                createdDate: createdDate,
                owner: owner
               }
             }).promise()
             return {
              PK: userId,
              SK: imageId,
              description: description,
              imageUrl: attachmentUrl,
              createdDate: createdDate,
              owner: owner
             }

         } catch(e) {
           throw Error(e.message)
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