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
         console.log('calling createImageRecord', description, imageId, userId, attachmentUrl)
         const  createdDate = new Date().toISOString()

         try {
           const result = await this.docClient.put({
               TableName: this.sisTable,
              //  Key: {
              //    PK: `USER#${userId}`,
              //    SK: `IMAGE#${imageId}`
              //  },
              // UpdateExpression: "SET SK = :d",
              //  ExpressionAttributeValues: {
              //   ":d" : `IMAGE#${imageId}`
              // },
              // ReturnValues:"UPDATED_NEW"
               Item: {
                PK: `USER#${userId}`,
                SK: `IMAGE#${imageId}`,
                description: description,
                imageId: imageId,
                createdDate: createdDate,
                imageUrl: attachmentUrl
               }
              //  Key: {
              //   PK: `USER#${userId}`
              //  },
              //  ConditionExpression : "attribute_exists(PK)",
              //  UpdateExpression: "ADD #SK = :keyImageId",
              //  ExpressionAttributeValues: {
              //   "#SK": `IMAGE#${userId}`,
              //   ":keyImageId" : "test"
              // },


              //  Item: {
                
              //   SK : `IMAGE#${imageId}`,
              //   description: description,
              //   imageId: imageId,
              //   createdDate: createdDate,
              //   imageUrl: attachmentUrl
              //  },
                      
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