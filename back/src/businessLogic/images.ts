import { Image } from '../models/Image'
import { ImageAccess } from '../dataLayer/imageAccess'

const imageAccess = new ImageAccess()

export async function getUserImages(userId: string): Promise<Image[]> {
    return await imageAccess.getUserImages(userId)
}

export async function deleteUserImage(userId: string, imageId: string): Promise<Boolean> {
    return await imageAccess.deleteUserImage(userId, imageId)
}

export async function getAllImages(): Promise<Image[]> {
    return await imageAccess.getAllImages()
}
  
export async function createImageRecord(description: string, imageId: string, userId: string, owner: string): Promise<any> {
    return await imageAccess.createImageRecord(description, imageId, userId, owner)
}