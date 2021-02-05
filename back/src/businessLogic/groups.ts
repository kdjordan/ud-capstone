import { Group } from '../models/Group'
// import { APIGatewayProxyEvent } from 'aws-lambda'
import { GroupAccess } from '../dataLayer/groupAccess'

const groupAccess = new GroupAccess()

export async function getGroups(): Promise<Group[]> {
    return await groupAccess.getGroups()
  }