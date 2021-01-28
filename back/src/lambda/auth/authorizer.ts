import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

// const { jwt } = require('jsonwebtoken');
import { verify, decode } from 'jsonwebtoken'
import jwkToPem  from 'jwk-to-pem'



import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'


const userPool = process.env.USER_POOL_ID
const url = `https://cognito-idp.us-west-2.amazonaws.com/${userPool}/.well-known/jwks.json`


export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  console.log('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}



async function verifyToken(authHeader: string): Promise<JwtPayload> {
  try {
    const token = getToken(authHeader)
    // console.log("Here's the token", token)
    
    const jwt: Jwt = decode(token, { complete: true }) as Jwt
    let jsonKeys = await Axios.get(url)

    console.log("The Keys are", jsonKeys.data.keys)
    
    let key = jsonKeys.data.keys.filter(key => key.kid === jwt.header.kid)
    // console.log("The key here", key)
    let pem = jwkToPem(key[0]);
  
    // console.log("The pem keys here", pem)

  
    // let cert = `-----BEGIN CERTIFICATE-----\n${signingKeys["0"].n}\n-----END CERTIFICATE-----`
  
    
    // return verify(token, cert, {algorithms:['RS256']}) as JwtPayload
    return  verify(token, pem, { algorithms: ['RS256'] }) as JwtPayload

    

  } catch (e) {
    console.log("Error", e)
  }
}

function getToken(authHeader: string): string {
  console.log("Gonna authorize", authHeader)
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]
  console.log("returning token", token)
  return token
}
