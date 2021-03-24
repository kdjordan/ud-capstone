import { User } from '../models/User'
import { UserAccess } from '../dataLayer/userAccess'

const userAccess = new UserAccess()

export async function addUser(userId: string, username: string, email: string): Promise<User> {
    //check to see iof user exists in User Table - if not add User 
    //returns empty User Type if user exists to satisfy return value
    const user = await userAccess.getUser(userId, email)
    if(!user) {
      return await userAccess.addUser(userId, username, email)
    } else {
      return {
        userId : '',
        username: '',
        email: ''
      }
    }
  }


  