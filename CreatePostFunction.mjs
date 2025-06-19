// CreatePostFunction.mjs

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from 'crypto';

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://master.ddue50gwnbp85.amplifyapp.com",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Credentials": "true"
};

function parseFormData(body, boundary) {
  const fields = {};
  const parts = body.split(`--${boundary}`);
  
  console.log("FormData parts count:", parts.length);
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.includes('Content-Disposition: form-data')) {
      console.log(`Part ${i}:`, part.substring(0, 200));
      
      const nameMatch = part.match(/name="([^"]+)"/);
      if (nameMatch) {
        const fieldName = nameMatch[1];
        const lines = part.split('\r\n');
        
        // Find the empty line that separates headers from content
        let contentStartIndex = -1;
        for (let j = 0; j < lines.length; j++) {
          if (lines[j] === '') {
            contentStartIndex = j + 1;
            break;
          }
        }
        
        if (contentStartIndex > -1 && contentStartIndex < lines.length) {
          // Get all lines from content start until end, excluding the last empty line
          const contentLines = lines.slice(contentStartIndex, -1);
          fields[fieldName] = contentLines.join('\r\n');
          console.log(`Extracted field ${fieldName}:`, fields[fieldName]);
        }
      }
    }
  }
  
  console.log("Final parsed fields:", Object.keys(fields));
  return fields;
}

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
    console.log("Received event:", JSON.stringify(event));
    
    let requestBody;
    
    // Check if request is FormData or JSON
    const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
    console.log("Content-Type:", contentType);
    
    if (contentType.includes('multipart/form-data')) {
      const boundary = contentType.split('boundary=')[1];
      console.log("Boundary:", boundary);
      
      const body = event.isBase64Encoded ? 
        Buffer.from(event.body, 'base64').toString() : 
        event.body;
      
      console.log("Body length:", body.length);
      console.log("Body preview:", body.substring(0, 500));
      
      requestBody = parseFormData(body, boundary);
    } else {
      requestBody = JSON.parse(event.body);
    }
    
    console.log("Parsed request body:", JSON.stringify(requestBody));
    
    // Validate required fields
    if (!requestBody.Title || !requestBody.Message || !requestBody.Author) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing required fields" })
      };
    }
    
    // Generate a unique ID for the post
    const postId = randomUUID();
    
    // Create the post item
    const postItem = {
      postId: postId,
      Title: requestBody.Title,
      Message: requestBody.Message,
      Author: requestBody.Author,
      groupId: requestBody.groupId || "general",
      Timestamp: requestBody.Timestamp || new Date().toISOString()
    };
    
    // Add attachment if present
    if (requestBody.Attachment) {
      postItem.Attachment = {
        FileName: requestBody.Attachment.FileName,
        FileType: requestBody.Attachment.FileType,
        FileKey: requestBody.Attachment.FileKey,
        FileUrl: requestBody.Attachment.FileUrl
      };
    }
    
    console.log("Saving item to DynamoDB:", JSON.stringify(postItem));
    
    // Save to DynamoDB
    await ddb.send(new PutCommand({
      TableName: "Posts",
      Item: postItem
    }));
    
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: "Post created successfully", 
        postId: postId 
      })
    };
    
  } catch (err) {
    console.error("Error creating post:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: "Failed to create post", 
        message: err.message,
        stack: err.stack
      })
    };
  }
};