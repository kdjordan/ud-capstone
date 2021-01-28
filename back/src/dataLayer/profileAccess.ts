// import * as AWS  from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
const AWSXRay = require('aws-xray-sdk-core');
const XAWS = AWSXRay.captureAWS(require('aws-sdk'));
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

// const XAWS = AWSXRay.captureAWS(AWS)
// const s3 = new XAWS.S3({
//     signatureVersion: 'v4'
//   })

import { ProfileItem } from '../models/ProfileItem'
// import { TodoUpdate } from '../models/TodoUpdate'
import { Dealer } from '../models/Dealer'

export class ProfileAccess {
 
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly profileTable = process.env.PROFILE_TABLE
    // private readonly usersTable = process.env.USERS_TABLE,
    // private readonly imagesBucket = process.env.DEALERS_IMAGES_BUCKET,
    // private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION 
    ) {
  }

  // async getSignedUrl(dealerId: string, adminId: string): Promise<any> {
  //     try {
  //       let imageUrl = createAttachmentUrl(this.imagesBucket, dealerId)

  //       const uploadUrl = s3.getSignedUrl('putObject', {
  //           Bucket: this.imagesBucket,
  //           Key: dealerId,
  //           Expires: Number(this.urlExpiration)
  //       })

  //       await this.updateUrl(imageUrl, adminId, dealerId)
    
  //       return {
  //           uploadUrl,
  //           imageUrl
  //       }
  //     } catch (e) {
  //       console.log("ERROR getting url in ACCESS", e);
        
  //     }
  // }

  async checkProfileExists(adminId: string): Promise<boolean> {
    try {
      console.log("adminID is", adminId)
        let result = await this.docClient.query({
            TableName: this.profileTable,
            KeyConditionExpression: 'adminId = :id',
            ExpressionAttributeValues: { ':id': adminId }
        }).promise()
        console.log("result", result);
        
        if(result.Items.length == 0) {
          return false
        } else {
          return true
        }
  
    } catch (e) {
      console.log("ERROR checking user in ACCESS", e);
    }
    
  }

  async addProfile(adminId: string, shopName: string): Promise<Dealer> {
      //add User to Users Table
      console.log('adminID', adminId)
      console.log('shopName', shopName)
      try {
        const newId = { adminId, shopName}
        console.log('newId', newId)
        await this.docClient.put({
            TableName: this.profileTable,
            Item: newId
        }).promise()

        let profile = {
            adminId: newId.adminId,
            shopName: newId.shopName

        }

        return profile

      } catch (e) {
          console.log("ERROR adding user in ACCESS", e)
      }

  }

   async getProfile(dealerId: string): Promise<ProfileItem[]> {
    try {
        let profile = await this.docClient.query({
           TableName: this.profileTable,
           KeyConditionExpression: 'dealerId = :id',
           ExpressionAttributeValues: {
               ':id': dealerId
           }
       }).promise()
       console.log(profile)
        const items = profile.Items
        return items as ProfileItem[]
    } catch (e) {
        console.log("ERROR getting todos in ACCESS", e)
    }
   }

//    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
//        try {
//            await this.docClient.put({
//              TableName: this.todosTable,
//              Item: todoItem
//            }).promise()

//            return todoItem

//        } catch (e) {
//            console.log("ERROR creating TODO in ACCESS")
//        }

//    }

//    async updateTodo(todoId: string, userId: string, todoItem: TodoUpdate): Promise<TodoUpdate>{
//        try {
//            await this.docClient.update({
//              TableName: this.todosTable,
//              Key: {
//                 userId,
//                 todoId
//               },
//               UpdateExpression: "set #theName = :n, #isDone = :d, #theDueDate = :due",
//               ExpressionAttributeValues: {
//                   ":n": todoItem.name,
//                   ":d": todoItem.done,
//                   ":due": todoItem.dueDate
//               },
//               ExpressionAttributeNames: {
//                   "#theName": 'name',
//                   "#isDone": 'done',
//                   "#theDueDate": 'dueDate'
//               },
//               ReturnValues:"UPDATED_NEW"
//            }).promise()
        
//            return todoItem

//        } catch (e) {
//            console.log("ERROR updating TODO in ACCESS ", e)
//        }

//    }

//    async deleteTodo(todoId: string, id: string): Promise<string> {
//        try {
//            await this.docClient.delete({
//                TableName: this.todosTable,
//                Key: { 
//                    userId: id, 
//                    todoId 
//                }
//                }).promise()
       
//            return todoId
//        } catch (e) {
//         console.log("ERROR deleting TODO in ACCESS")
//        }
//     }
    // TODO UPDATE todos Table with attachment URL
    // async updateUrl(url: string, todoId: string, userId: string) {
    //     try {   
    //         await this.docClient.update({
    //             TableName: this.profileTable,
    //             Key: {
    //                 userId,
    //                 todoId
    //             },
    //             UpdateExpression: "set #attach = :a",
    //             ExpressionAttributeValues: {
    //               ":a": url,
                  
    //             },
    //             ExpressionAttributeNames: {
    //               "#attach": 'attachmentUrl',
    //             },
    //              ReturnValues:"UPDATED_NEW"

    //         }).promise()
    //     } catch (e) {
    //         console.log("ERROR in updateURL ", e);
            
    //     }

    // }
    
}//end constructor


function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:3000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}

// function createAttachmentUrl(bucketName: string, profileId: string): string {
//     return `https://${bucketName}.s3.amazonaws.com/${profileId}`
// }

