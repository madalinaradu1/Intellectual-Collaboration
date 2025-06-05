// PostConfirmationLambda.mjs
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    console.log("Post confirmation event:", JSON.stringify(event));
    
    // Extract user attributes
    const userId = event.request.userAttributes.sub;
    const email = event.request.userAttributes.email;
    const firstName = event.request.userAttributes.given_name || "";
    const lastName = event.request.userAttributes.family_name || "";
    
    // Determine role based on email domain
    let role = 'Guest';
    
    if (email.endsWith('@gcu.edu')) {
      role = 'FacultyMember';
    } else if (email.endsWith('@my.gcu.edu')) {
      role = 'Student';
    }
    // All others remain as Guest
    
    // Create user record in DynamoDB
    await ddb.send(new PutCommand({
      TableName: "Users",
      Item: {
        userId: userId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        enabled: true
      }
    }));
    
    console.log(`User ${userId} added to Users table with role ${role}`);
    
    // Return the event to continue the flow
    return event;
  } catch (error) {
    console.error("Error in post confirmation:", error);
    throw error;
  }
};