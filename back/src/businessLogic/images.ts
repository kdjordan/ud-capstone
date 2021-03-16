import { Image } from '../models/Image'
// import { ImageRecord } from '../models/ImageRecord'
// import { APIGatewayProxyEvent } from 'aws-lambda'
import { ImageAccess } from '../dataLayer/imageAccess'

const imageAccess = new ImageAccess()

export async function getImage(userId: string): Promise<Image[]> {
    return await imageAccess.getImage(userId)
  }
  
export async function putImage(description: string, imageId: string, userId: string, createdAt: string): Promise<Image> {
    return await imageAccess.putImage(description, imageId, userId, createdAt)
  }

// export async function createImageRecord(description: string, imageId: string, userId: string, groupId: string): Promise<any> {
//     const  createdDate = new Date().toISOString()
//     return await groupAccess.createImageRecord(description, imageId, userId, groupId, createdDate)
//   }