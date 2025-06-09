// DeleteUserLambda.mjs
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { CognitoIdentityProviderClient, AdminDeleteUserCommand, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";

const ddbClient = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(ddbClient);
const cognitoClient = new CognitoIdentityProviderClient({});

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://master.ddue50gwnbp85.amplifyapp.com",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Credentials": "true"
};

// Your Cognito User Pool ID - replace with your actual User Pool ID
const USER_POOL_ID = "us-east-1_XXXXXXXXX";

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
    console.log("Delete user event:", JSON.stringify(event));
    
    // Extract user info from token
    const callerRole = event.requestContext.authorizer.claims['custom:role'] || 'Guest';
    const callerGroups = event.requestContext.authorizer.claims['cognito:groups'] || [];
    
    // Check if caller has permission (ApplicationAdmin or GroupAdmin)
    const isAdmin = callerRole === 'ApplicationAdmin' || 
                   callerRole === 'GroupAdmin' || 
                   callerGroups.includes('ApplicationAdmin');
    
    if (!isAdmin) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: "Access denied", 
          message: "Only Application Admins and Group Admins can delete users" 
        })
      };
    }
    
    // Parse request body
    const requestBody = JSON.parse(event.body);
    const email = requestBody.email;
    
    if (!email) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: "Invalid request", 
          message: "Email is required" 
        })
      };
    }
    
    // Find user in Cognito by email
    const listUsersResponse = await cognitoClient.send(new ListUsersCommand({
      UserPoolId: USER_POOL_ID,
      Filter: `email = "${email}"`,
      Limit: 1
    }));
    
    if (!listUsersResponse.Users || listUsersResponse.Users.length === 0) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: "User not found", 
          message: `No user found with email ${email}` 
        })
      };
    }
    
    const username = listUsersResponse.Users[0].Username;
    
    // Delete user from Cognito
    await cognitoClient.send(new AdminDeleteUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: username
    }));
    
    // Delete user from DynamoDB
    try {
      // Scan the Users table to find the user by email
      const scanResponse = await ddb.send(new ScanCommand({
        TableName: "Users",
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email
        }
      }));
      
      if (scanResponse.Items && scanResponse.Items.length > 0) {
        // Delete the user record
        await ddb.send(new DeleteCommand({
          TableName: "Users",
          Key: {
            userId: scanResponse.Items[0].userId
          }
        }));
        console.log(`Deleted user ${email} from DynamoDB`);
      } else {
        console.log(`User ${email} not found in DynamoDB`);
      }
    } catch (dbError) {
      console.error("Error deleting user from DynamoDB:", dbError);
      // Continue even if DynamoDB deletion fails
    }
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: `User ${email} deleted successfully`
      })
    };
    
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Failed to delete user",
        message: error.message
      })
    };
  }
};