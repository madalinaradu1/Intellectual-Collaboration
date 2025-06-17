// Lambda function to get basic user profile information
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(dynamoClient);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://master.ddue50gwnbp85.amplifyapp.com",
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
    console.log("Get user profile event:", JSON.stringify(event));
    
    // Get user ID from path parameters
    const userId = event.pathParameters.userId;
    
    // Get user from DynamoDB
    const getParams = {
      TableName: "Users",
      Key: {
        userId: userId
      },
      ProjectionExpression: "userId, firstName, lastName, profilePicture" // Only return basic profile info
    };
    
    const result = await ddb.send(new GetCommand(getParams));
    
    if (!result.Item) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "User not found"
        })
      };
    }
    
    // Return only public profile information
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        userId: result.Item.userId,
        firstName: result.Item.firstName || "",
        lastName: result.Item.lastName || "",
        profilePicture: result.Item.profilePicture || ""
      })
    };
    
  } catch (error) {
    console.error("Error getting user profile:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Error getting user profile",
        error: error.message
      })
    };
  }
};