// import * as uuid from 'uuid'


import { ProfileItem } from '../models/ProfileItem'
import { Dealer } from '../models/Dealer'
import { ProfileAccess } from '../dataLayer/profileAccess'
// import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { getTheDealerId } from '../lambda/utils'


// import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { APIGatewayProxyEvent } from 'aws-lambda'

const profileAccess = new ProfileAccess()

// export async function getSignedUrl(event: APIGatewayProxyEvent): Promise<String> {
//     const profileId = event.pathParameters.todoId
//     const adminId = getAdminId(event)
//     return await profileAccess.getSignedUrl(todoId, userId)
// }

export async function getDealer(dealerId: string): Promise<ProfileItem[]> {
  return await profileAccess.getProfile(dealerId)
}

export async function getDealerId(event: APIGatewayProxyEvent): Promise<string> {
  return getTheDealerId(event)
  
}

export async function checkDealerExists(adminId: string): Promise<boolean> {
    return await profileAccess.checkProfileExists(adminId)
}

export async function addProfile(adminId: string, shopName: string): Promise<Dealer> {
  return await profileAccess.addProfile(adminId, shopName)
}

// export async function createTodo(event: APIGatewayProxyEvent): Promise<TodoItem> {
//     const newTodo: CreateTodoRequest = JSON.parse(event.body)
//     const itemId = uuid.v4()
//     const userId = getUserId(event)

//     return await todoAccess.createTodo({
//         todoId: itemId,
//         userId: userId,
//         name: newTodo.name,
//         dueDate: newTodo.dueDate,
//         createdAt: new Date().toISOString(),
//         attachmentUrl: '',
//         done: false
//     })
// }

// export async function updateTodo(event: APIGatewayProxyEvent): Promise<UpdateTodoRequest> {
//     const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
//     const todoId = event.pathParameters.todoId
//     const userId = getUserId(event)

//     return await todoAccess.updateTodo(todoId, userId, updatedTodo)
// }

// export async function deleteTodo(event: APIGatewayProxyEvent){
//     let todoId = event.pathParameters.todoId
//     let userId = getUserId(event)
    
//     return await todoAccess.deleteTodo(todoId, userId)
// }

