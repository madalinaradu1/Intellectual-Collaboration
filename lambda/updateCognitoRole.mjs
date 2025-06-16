// Lambda function to directly update a user's role in Cognito
import { 
  CognitoIdentityProviderClient, 
  ListUsersCommand,
  AdminUpdateUserAttributesCommand 
} from "@aws-sdk/client-cognito-identity-provider";

// Initialize client
const cognitoClient = new CognitoIdentityProviderClient();

// Environment variables
const USER_POOL_ID = 'us-east-1_JHnm7JteW';

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': 'https://master.ddue50gwnbp85.amplifyapp.com',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'OPTIONS,PUT',
  'Access-Control-Allow-Credentials': true
};

export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event));
  
  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  
  try {
    // Extract userId from path parameters
    if (!event.pathParameters || !event.pathParameters.userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: 'Missing userId in request'
        })
      };
    }
    
    const userId = event.pathParameters.userId;
    const body = JSON.parse(event.body);
    const role = body.role;
    const email = body.email;
    
    if (!role) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: 'Missing role in request body'
        })
      };
    }
    
    console.log(`Attempting to update Cognito role for user ${userId} to ${role}`);
    
    // First try to find user by sub (userId)
    let listUsersParams = {
      UserPoolId: USER_POOL_ID,
      Filter: `sub = "${userId}"`
    };
    
    let listUsersResponse = await cognitoClient.send(
      new ListUsersCommand(listUsersParams)
    );
    
    // If not found by sub, try by email
    if (!listUsersResponse.Users || listUsersResponse.Users.length === 0) {
      if (email) {
        console.log(`User not found by sub, trying email: ${email}`);
        listUsersParams = {
          UserPoolId: USER_POOL_ID,
          Filter: `email = "${email}"`
        };
        
        listUsersResponse = await cognitoClient.send(
          new ListUsersCommand(listUsersParams)
        );
      }
    }
    
    // If user found, update attribute
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
              Value: role
            }
          ]
        })
      );
      
      console.log(`Successfully updated Cognito user ${cognitoUsername} role to ${role}`);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Cognito role updated successfully',
          username: cognitoUsername,
          role: role
        })
      };
    } else {
      console.warn(`No Cognito user found for userId=${userId} or email=${email}`);
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          message: 'User not found in Cognito',
          userId: userId,
          email: email
        })
      };
    }
  } catch (error) {
    console.error('Error updating Cognito role:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Error updating Cognito role',
        error: error.message
      })
    };
  }
};