const AWSXRay = require('aws-xray-sdk-core');
const XAWS = AWSXRay.captureAWS(require('aws-sdk'));
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { Group} from '../models/Group'

export class GroupAccess {
 
    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly groupTable = process.env.GROUP_TABLE
      ) {
    }

    async getGroups(): Promise<Group[]> {
        try {
            let groups = await this.docClient.scan({
               TableName: this.groupTable,
           }).promise()
           console.log(groups)
            const items = groups.Items
            return items as Group[]
        } catch (e) {
            console.log("ERROR getting groups in ACCESS", e)
        }
       }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8080'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }