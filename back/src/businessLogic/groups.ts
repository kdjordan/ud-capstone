import { Group } from '../models/Group'
// import { ImageRecord } from '../models/ImageRecord'
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

export async function createImageRecord(description: string, imageId: string, userId: string, groupId: string): Promise<any> {
    const  createdDate = new Date().toISOString()
    return await groupAccess.createImageRecord(description, imageId, userId, groupId, createdDate)
  }