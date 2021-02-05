import { User } from '../models/User'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { GroupItem } from '../models/GroupItem'


export async function getGroups(UserId: string): Promise<GroupItem[]> {
    return await profileAccess.getProfile(dealerId)
  }
  