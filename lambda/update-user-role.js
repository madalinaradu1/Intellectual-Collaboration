// Lambda function to update a user's role in both Cognito and DynamoDB
const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Get environment variables
const USER_POOL_ID = process.env.USER_POOL_ID;
const USERS_TABLE = process.env.USERS_TABLE;

exports.handler = async (event) => {
    try {
        console.log('Event:', JSON.stringify(event));
        
        // Get origin from request headers
        const origin = event.headers && event.headers.origin 
            ? event.headers.origin 
            : 'https://master.ddue50gwnbp85.amplifyapp.com';
        
        // CORS headers with specific origin
        const headers = {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,DELETE',
            'Access-Control-Allow-Credentials': true
        };
        
        // Handle OPTIONS request (preflight)
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers,
                body: ''
            };
        }
        
        // Check if this is an API Gateway event
        if (!event.pathParameters || !event.body) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'Invalid request format' })
            };
        }
        
        // Parse request
        const userId = event.pathParameters.userId;
        const body = JSON.parse(event.body);
        const newRole = body.role;
        const updateCognito = body.updateCognito === true;
        
        if (!userId || !newRole) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'Missing required parameters' })
            };
        }
        
        // Update user in DynamoDB
        await dynamoDB.update({
            TableName: USERS_TABLE,
            Key: { userId },
            UpdateExpression: 'set #role = :role',
            ExpressionAttributeNames: {
                '#role': 'role'
            },
            ExpressionAttributeValues: {
                ':role': newRole
            }
        }).promise();
        
        // Update user in Cognito if requested
        if (updateCognito) {
            // First, find the user in Cognito by their user ID (sub)
            const listUsersResponse = await cognito.listUsers({
                UserPoolId: USER_POOL_ID,
                Filter: `sub = "${userId}"`
            }).promise();
            
            if (listUsersResponse.Users && listUsersResponse.Users.length > 0) {
                const cognitoUsername = listUsersResponse.Users[0].Username;
                
                // Update the user's custom:role attribute
                await cognito.adminUpdateUserAttributes({
                    UserPoolId: USER_POOL_ID,
                    Username: cognitoUsername,
                    UserAttributes: [
                        {
                            Name: 'custom:role',
                            Value: newRole
                        }
                    ]
                }).promise();
                
                console.log(`Updated Cognito user ${cognitoUsername} role to ${newRole}`);
            } else {
                console.warn(`User with ID ${userId} not found in Cognito`);
            }
        }
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                message: 'User role updated successfully',
                userId,
                role: newRole
            })
        };
    } catch (error) {
        console.error('Error updating user role:', error);
        
        // Get origin from request headers
        const origin = event.headers && event.headers.origin 
            ? event.headers.origin 
            : 'https://master.ddue50gwnbp85.amplifyapp.com';
        
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,DELETE',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({ 
                message: 'Error updating user role',
                error: error.message
            })
        };
    }
};