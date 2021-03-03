import { User } from '../models/User'
import { UserAccess } from '../dataLayer/userAccess'

const userAccess = new UserAccess()

export async function addUser(userId: string, username: string, email: string): Promise<User> {
    return await userAccess.addUser(userId, username, email)
  }

export async function checkUser(userId: string): Promise<Boolean> {
    return await userAccess.checkUser(userId)
  }

export async function createImage(image: object): Promise<Boolean> {
    const url = userAccess.getUploadUrl()
    console.log('URL in user.ts:', url)
    return await userAccess.createImage(image)
  }



  