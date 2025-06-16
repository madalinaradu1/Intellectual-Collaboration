// update-role-lambda.mjs
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand } from "@aws-sdk/client-cognito-identity-provider";

const dynamoClient = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(dynamoClient);
const cognitoClient = new CognitoIdentityProviderClient({});

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "PUT,OPTIONS",
  "Access-Control-Allow-Credentials": "true"
};

export const handler = async (event) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    console.log("Update user role event:", JSON.stringify(event));
    
    // Get user ID from path parameters
    const userId = event.pathParameters.userId;
    
    // Parse request body
    const requestBody = JSON.parse(event.body);
    const newRole = requestBody.role;
    
    // Validate role
    const validRoles = ['ApplicationAdmin', 'GroupAdmin', 'GroupOfficer', 'FacultyMember', 'Student', 'Guest'];
    if (!validRoles.includes(newRole)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: "Invalid role",
          message: `Role must be one of: ${validRoles.join(', ')}`
        })
      };
    }
    
    // Get user info from Cognito
    const userPoolId = process.env.USER_POOL_ID;
    if (!userPoolId) {
      throw new Error("USER_POOL_ID environment variable is not set");
    }
    
    // Update user attributes in Cognito
    await cognitoClient.send(new AdminUpdateUserAttributesCommand({
      UserPoolId: userPoolId,
      Username: userId,
      UserAttributes: [
        {
          Name: 'custom:role',
          Value: newRole
        }
      ]
    }));
    
    // Update user in DynamoDB
    await ddb.send(new UpdateCommand({
      TableName: "Users",
      Key: {
        userId: userId
      },
      UpdateExpression: "set #role = :role, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#role": "role"
      },
      ExpressionAttributeValues: {
        ":role": newRole,
        ":updatedAt": new Date().toISOString()
      }
    }));
    
    console.log(`User ${userId} role updated to ${newRole}`);
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: `User role updated to ${newRole} successfully`,
        userId: userId
      })
    };
    
  } catch (error) {
    console.error("Error updating user role:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Failed to update user role",
        message: error.message
      })
    };
  }
};