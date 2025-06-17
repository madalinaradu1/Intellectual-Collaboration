// Lambda function to handle user permissions for the /cms/users endpoint
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(dynamoClient);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
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
    // Get user role from requestContext
    const userRole = event.requestContext.authorizer?.claims?.['custom:role'] || 'Guest';
    const cognitoGroups = event.requestContext.authorizer?.claims?.['cognito:groups'] || [];
    
    // Check if user is an admin
    const isAdmin = userRole === 'ApplicationAdmin' || 
                   userRole === 'GroupAdmin' || 
                   cognitoGroups.includes('ApplicationAdmin') || 
                   cognitoGroups.includes('GroupAdmin');
    
    // Allow access to /cms/users/me for all authenticated users
    if (event.pathParameters && event.pathParameters.userId === 'me') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ allowed: true })
      };
    }
    
    // For other user endpoints, only admins can access
    if (isAdmin) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ allowed: true })
      };
    }
    
    // For FacultyMembers, allow access to basic user info for posts
    if (userRole === 'FacultyMember' && event.queryStringParameters && event.queryStringParameters.forPost === 'true') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ allowed: true, limitedAccess: true })
      };
    }
    
    // Deny access for all other cases
    return {
      statusCode: 403,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Access denied',
        userRole: userRole
      })
    };
  } catch (error) {
    console.error('Error checking permissions:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Error checking permissions',
        error: error.message
      })
    };
  }
};