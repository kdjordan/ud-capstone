import { Image } from '../models/Image'
import { ImageAccess } from '../dataLayer/imageAccess'

const imageAccess = new ImageAccess()

// export async function getImage(userId: string): Promise<Image> {
//     return await imageAccess.getImage(userId)
// }
export async function getAllImages(): Promise<Image[]> {
    return await imageAccess.getAllImages()
}
  
export async function createImageRecord(description: string, imageId: string, userId: string): Promise<any> {
    return await imageAccess.createImageRecord(description, imageId, userId)
}