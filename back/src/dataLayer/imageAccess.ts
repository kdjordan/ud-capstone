const AWSXRay = require('aws-xray-sdk-core');
const XAWS = AWSXRay.captureAWS(require('aws-sdk'))
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Image } from '../models/Image'

export class ImageAccess {
 
    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly sisImages = process.env.SIS_IMAGES,
      private readonly imagesBucket = process.env.USER_IMAGES_BUCKET
      ) {
    }

    // async getImage(imageId: string): Promise<Image> {
    //     try {
    //       const theImage = await this.docClient.get({
    //         TableName: this.sisImages,
    //         Key: {
    //           PK: imageId
    //         }
    //       }).promise()
    //       return theImage as Image
    //     } catch (e) {
    //         console.log('Error searching for the image', e)
    //         return e
    //     }
    //    }

    async getAllImages(): Promise<Image[]> {
        try {
            const images = await this.docClient.scan({
              TableName: this.sisImages,
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
    // sample comment

       async createImageRecord(description: string, imageId: string, userId: string) {
         const attachmentUrl = createAttachmentUrl(this.imagesBucket, imageId)
         const  createdDate = new Date().toISOString()

         try {
           const result = await this.docClient.put({
               TableName: this.sisImages,
               Item: {
                PK: imageId,
                SK: createdDate,
                description: description,
                imageUrl: attachmentUrl,
                owner: userId
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