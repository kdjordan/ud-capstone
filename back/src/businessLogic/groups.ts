import { Group } from '../models/Group'
// import { APIGatewayProxyEvent } from 'aws-lambda'
import { GroupAccess } from '../dataLayer/groupAccess'

const groupAccess = new GroupAccess()

export async function getGroups(): Promise<Group[]> {
    return await groupAccess.getGroups()
  }

export async function addGroup(groupId: string, description: string, groupUrl: string): Promise<Group> {
    return await groupAccess.addGroup(groupId, description, groupUrl)
  }

export async function checkGroup(groupId: string): Promise<Boolean> {
    return await groupAccess.checkGroup(groupId)
  }