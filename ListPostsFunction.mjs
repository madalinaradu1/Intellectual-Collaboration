// ListPostsFunction.mjs
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

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
    console.log("List posts event:", JSON.stringify(event));
    
    // Get all posts
    const result = await ddb.send(new ScanCommand({
      TableName: "Posts",
      Limit: 50 // Limit to 50 posts for performance
    }));
    
    const posts = result.Items || [];
    
    // Sort posts by timestamp (newest first)
    posts.sort((a, b) => {
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    });
    
    // Get author information for each post
    for (const post of posts) {
      if (post.Author) {
        try {
          // Try to get user info from Users table
          const userResponse = await ddb.send(new GetCommand({
            TableName: "Users",
            Key: {
              userId: post.Author
            }
          }));
          
          if (userResponse.Item) {
            // Add author data to the post
            post.AuthorData = {
              firstName: userResponse.Item.firstName || '',
              lastName: userResponse.Item.lastName || '',
              email: userResponse.Item.email || ''
            };
          }
        } catch (userErr) {
          console.log(`Could not get user info for ${post.Author}:`, userErr);
          // Continue without author data
        }
      }
    }
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(posts)
    };
    
  } catch (err) {
    console.error("Error listing posts:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: "Failed to list posts", 
        message: err.message 
      })
    };
  }
};