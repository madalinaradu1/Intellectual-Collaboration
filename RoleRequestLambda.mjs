// RoleRequestLambda.mjs
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://master.ddue50gwnbp85.amplifyapp.com",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
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
    console.log("Role request event:", JSON.stringify(event));
    
    // Parse request body
    const requestBody = JSON.parse(event.body);
    
    // Extract user info from token
    const userId = event.requestContext.authorizer.claims.sub;
    const email = event.requestContext.authorizer.claims.email;
    
    // Create a unique request ID
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    // Store the role request in DynamoDB
    await ddb.send(new PutCommand({
      TableName: "RoleRequests",
      Item: {
        requestId: requestId,
        userId: userId,
        email: email,
        currentRole: requestBody.currentRole || "Guest",
        requestedRole: requestBody.requestedRole,
        justification: requestBody.justification,
        parentGroup: requestBody.parentGroup || "",
        status: "Pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }));
    
    console.log(`Role request ${requestId} created for user ${userId}`);
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Role request submitted successfully",
        requestId: requestId
      })
    };
    
  } catch (error) {
    console.error("Error processing role request:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Failed to process role request",
        message: error.message
      })
    };
  }
};