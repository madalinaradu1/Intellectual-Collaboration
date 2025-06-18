// Lambda function to update the Users table schema to add lastLoginDate field
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(dynamoClient);

export const handler = async (event) => {
    console.log("Starting user schema update");
    
    try {
        // Get all users from DynamoDB
        const scanResult = await ddb.send(new ScanCommand({
            TableName: "Users",
            ProjectionExpression: "userId"
        }));

        console.log(`Found ${scanResult.Items.length} users to update`);
        
        // Process each user
        const promises = scanResult.Items.map(async (user) => {
            // Add lastLoginDate field with current date as default
            await ddb.send(new UpdateCommand({
                TableName: "Users",
                Key: { userId: user.userId },
                UpdateExpression: "set lastLoginDate = if_not_exists(lastLoginDate, :date), enabled = if_not_exists(enabled, :enabled)",
                ExpressionAttributeValues: {
                    ":date": new Date().toISOString(),
                    ":enabled": true
                }
            }));
            
            console.log(`Updated schema for user: ${user.userId}`);
        });

        await Promise.all(promises);
        
        console.log(`User schema update completed for ${scanResult.Items.length} users.`);
        return { 
            statusCode: 200, 
            body: JSON.stringify({
                message: "User schema update completed",
                updatedCount: scanResult.Items.length
            })
        };

    } catch (error) {
        console.error("Error updating user schema:", error);
        return { 
            statusCode: 500, 
            body: JSON.stringify({
                message: "Error updating user schema",
                error: error.message
            })
        };
    }
};