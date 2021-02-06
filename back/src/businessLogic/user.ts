import { User } from '../models/User'
import { UserAccess } from '../dataLayer/userAccess'

const userAccess = new UserAccess()

export async function addUser(userId: string, userName: string, email: string): Promise<User> {
    return await userAccess.addUser(userId, userName, email)
  }