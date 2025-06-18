// Lambda function to check user activity and disable inactive users
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { CognitoIdentityProviderClient, AdminDisableUserCommand } from "@aws-sdk/client-cognito-identity-provider";

const dynamoClient = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(dynamoClient);
const cognitoClient = new CognitoIdentityProviderClient({});

// Configuration
const USER_POOL_ID = 'us-east-1_JHnm7JteW';
const INACTIVITY_THRESHOLD = 180; // 6 months in days

export const handler = async (event) => {
    console.log("Starting user activity check");
    
    try {
        // Get all users from DynamoDB
        const scanResult = await ddb.send(new ScanCommand({
            TableName: "Users",
            ProjectionExpression: "userId, lastLoginDate, enabled"
        }));

        console.log(`Found ${scanResult.Items.length} users to check`);
        
        const currentDate = new Date();
        let disabledCount = 0;
        
        // Process each user
        const promises = scanResult.Items.map(async (user) => {
            // Skip if no login date or already disabled
            if (!user.lastLoginDate || user.enabled === false) return;

            const lastLogin = new Date(user.lastLoginDate);
            const daysSinceLogin = Math.floor((currentDate - lastLogin) / (1000 * 60 * 60 * 24));

            if (daysSinceLogin > INACTIVITY_THRESHOLD) {
                console.log(`User ${user.userId} has been inactive for ${daysSinceLogin} days`);
                
                // Disable user in DynamoDB
                await ddb.send(new UpdateCommand({
                    TableName: "Users",
                    Key: { userId: user.userId },
                    UpdateExpression: "set enabled = :enabled, disabledReason = :reason, disabledAt = :date",
                    ExpressionAttributeValues: {
                        ":enabled": false,
                        ":reason": "Inactive for over 6 months",
                        ":date": new Date().toISOString()
                    }
                }));

                // Disable user in Cognito
                try {
                    await cognitoClient.send(new AdminDisableUserCommand({
                        UserPoolId: USER_POOL_ID,
                        Username: user.userId
                    }));
                    disabledCount++;
                    console.log(`Disabled inactive user: ${user.userId}`);
                } catch (cognitoError) {
                    console.error(`Error disabling user ${user.userId} in Cognito:`, cognitoError);
                }
            }
        });

        await Promise.all(promises);
        
        console.log(`User activity check completed. Disabled ${disabledCount} inactive users.`);
        return { 
            statusCode: 200, 
            body: JSON.stringify({
                message: "User activity check completed",
                disabledCount: disabledCount
            })
        };

    } catch (error) {
        console.error("Error checking user activity:", error);
        return { 
            statusCode: 500, 
            body: JSON.stringify({
                message: "Error checking user activity",
                error: error.message
            })
        };
    }
};