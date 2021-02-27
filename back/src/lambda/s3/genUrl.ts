import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

// const groupsTable = process.env.GROUPS_TABLE
// const imagesTable = process.env.USER_TABLE
const bucketName = process.env.USER_IMAGES_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Caller event', event)
  const body = JSON.parse(event.body);
  console.log(body)

  const imageId = uuid.v4()

  const url = getUploadUrl(imageId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: url,
      imageId
    })
  }
}

// async function groupExists(groupId: string) {
//   const result = await docClient
//     .get({
//       TableName: groupsTable,
//       Key: {
//         id: groupId
//       }
//     })
//     .promise()

//   console.log('Get group: ', result)
//   return !!result.Item
// }

// async function createImage(groupId: string, imageId: string, event: any) {
//   const timestamp = new Date().toISOString()
//   const newImage = JSON.parse(event.body)

//   const newItem = {
//     groupId,
//     timestamp,
//     imageId,
//     ...newImage,
//     imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
//   }
//   console.log('Storing new item: ', newItem)

//   await docClient
//     .put({
//       TableName: imagesTable,
//       Item: newItem
//     })
//     .promise()

//   return newItem
// }

function getUploadUrl(imageId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: Number(urlExpiration)
  })
}
