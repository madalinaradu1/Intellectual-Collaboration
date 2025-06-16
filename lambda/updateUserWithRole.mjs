// Lambda function with fixed userId extraction and CORS headers
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { 
  CognitoIdentityProviderClient, 
  ListUsersCommand,
  AdminUpdateUserAttributesCommand 
} from "@aws-sdk/client-cognito-identity-provider";
import { marshall } from "@aws-sdk/util-dynamodb";

// Initialize clients
const dynamoClient = new DynamoDBClient();
const cognitoClient = new CognitoIdentityProviderClient();

// Environment variables
const USER_POOL_ID = 'us-east-1_JHnm7JteW';
const USERS_TABLE = 'Users';

export const handler = async (event) => {
    console.log('Event:', JSON.stringify(event));
    
    // CORS headers - fixed by removing trailing slash
    const headers = {
        'Access-Control-Allow-Origin': 'https://master.ddue50gwnbp85.amplifyapp.com',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,DELETE',
        'Access-Control-Allow-Credentials': true
    };
    
    // Handle OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }
    
    try {
        // Extract userId from path parameters - add error checking
        if (!event.pathParameters || !event.pathParameters.userId) {
            console.error('Missing userId in path parameters:', event.pathParameters);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    message: 'Missing userId in request',
                    event: JSON.stringify(event)
                })
            };
        }
        
        const userId = event.pathParameters.userId;
        const body = JSON.parse(event.body);
        
        console.log('Updating user:', userId, 'with data:', body);
        
        // Update DynamoDB
        const updateParams = {
            TableName: USERS_TABLE,
            Key: { userId: { S: userId } },
            UpdateExpression: 'SET firstName = :firstName, lastName = :lastName, #role = :role',
            ExpressionAttributeNames: {
                '#role': 'role'
            },
            ExpressionAttributeValues: {
                ':firstName': { S: body.firstName || '' },
                ':lastName': { S: body.lastName || '' },
                ':role': { S: body.role || 'Guest' }
            }
        };
        
        await dynamoClient.send(new UpdateItemCommand(updateParams));
        
        // Update Cognito if role is provided
        if (body.role) {
            // Find user in Cognito
            const listUsersParams = {
                UserPoolId: USER_POOL_ID,
                Filter: `sub = "${userId}"`
            };
            
            const listUsersResponse = await cognitoClient.send(
                new ListUsersCommand(listUsersParams)
            );
            
            if (listUsersResponse.Users && listUsersResponse.Users.length > 0) {
                const cognitoUsername = listUsersResponse.Users[0].Username;
                
                // Update user attribute
                await cognitoClient.send(
                    new AdminUpdateUserAttributesCommand({
                        UserPoolId: USER_POOL_ID,
                        Username: cognitoUsername,
                        UserAttributes: [
                            {
                                Name: 'custom:role',
                                Value: body.role
                            }
                        ]
                    })
                );
                
                console.log(`Updated Cognito user ${cognitoUsername} role to ${body.role}`);
            } else {
                console.warn(`No Cognito user found with sub=${userId}`);
            }
        }
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'User updated successfully',
                userId,
                role: body.role
            })
        };
    } catch (error) {
        console.error('Error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                message: 'Error updating user',
                error: error.message,
                stack: error.stack
            })
        };
    }
};