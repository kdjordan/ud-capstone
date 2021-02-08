import { User } from '../models/User'
import { UserAccess } from '../dataLayer/userAccess'

const userAccess = new UserAccess()

export async function addUser(userId: string, username: string, email: string): Promise<User> {
    return await userAccess.addUser(userId, username, email)
  }

export async function checkUser(userId: string): Promise<Boolean> {
  let result = await userAccess.checkUser(userId)
  console.log("Result in user-ts", result)
    return await userAccess.checkUser(userId)
  }