const AWSXRay = require('aws-xray-sdk-core');
const XAWS = AWSXRay.captureAWS(require('aws-sdk'));
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { Image } from '../models/Image'
// import { ImageRecord } from '../models/ImageRecord'

export class ImageAccess {
 
    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly sisTable = process.env.SIS_TABLE,
      private readonly imagesBucket = process.env.USER_IMAGES_BUCKET
      ) {
    }

    async getImage(userId: string): Promise<Image> {
        try {
          const theImage = {
            imageId: "888",
            description: "holder",
            iamgeUrl: "URL"
          }
        //     const images = await this.docClient.scan({
        //        TableName: this.sisTable,
        //        KeyConditionExpression='#PK begins_with(USER#) ',
        //        ExpressionAttributeNames = {
        //         "#PK": "PK",
        //       }  
        //    }).promise()
        // //    console.log(iamges)
        //     const items = images.Items
        //     return items as Image[]
          return theImage as Image
        } catch (e) {
            console.log('Error searching for the image', e)
            return e
        }
       }

    async getAllImages(): Promise<Image[]> {
        try {
            const images = await this.docClient.query({
              TableName: this.sisTable,
              KeyConditionExpression: 'PK = PK begins_with(PK, :primary_key)',
              ExpressionAttributeValues: {
                ":primary_key": "USER#",
              }
                
           }).promise()
           console.log("the images are", images)
            const items = images.Items
            return items as Image[]
        } catch (e) {
          console.log('Error getting all images: ', e)
          throw Error(e)
        }
       }

    // async putImage(description: string, PK: string, imageId: string createdAt: string): Promise<Image> {
    //     try {
    //         const image = await this.docClient.update({
    //            TableName: this.sisTable,
    //            Key: { PK },

    //           //  Item: {
    //           //   SK: `USER#${imageId}`,
    //           //   createdAt:  createdAt,
    //           //   desciption: description,
    //            }
    //        }).promise()


    // UpdateExpression: "set #theImages = {imageUrl :iurl, owner: :uid, description: :desc, createdAt: :added",
    //            ExpressionAttributeNames: {
    //              ":iurl": attachmentUrl,
    //              ":uid": userId,
    //              ":desc": description,
    //              ":added": createdDate
    //            },
    //            ReturnValues: "UPDATED_NEW"
    //     //    console.log(iamges)
    //         return image as Image
    //     } catch (e) {
    //         return e
    //     }
    //    }

       async createImageRecord(description: string, imageId: string, userId: string) {
         const attachmentUrl = createAttachmentUrl(this.imagesBucket, imageId)
         const  createdDate = new Date().toISOString()

         try {
           const result = await this.docClient.put({
               TableName: this.sisTable,
               Item: {
                PK: `USER#${userId}`,
                SK: `IMAGE#${imageId}`,
                description: description,
                imageId: imageId,
                createdDate: createdDate,
                imageUrl: attachmentUrl
               }
             }).promise()
            
             return result

         } catch(e) {
           console.log('Error putting image in createImageRecord: ', e)
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