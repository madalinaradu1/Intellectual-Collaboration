// RoleRequestEmailLambda.mjs
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: "us-east-1" }); // Change to your region
const SENDER_EMAIL = "noreply@yourdomain.com"; // Change to your verified SES email
const ADMIN_EMAIL = "admin@yourdomain.com"; // Change to your admin email

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  
  // Process DynamoDB stream events
  for (const record of event.Records) {
    // Only process new role request insertions
    if (record.eventName === "INSERT") {
      try {
        const newRequest = record.dynamodb.NewImage;
        
        // Extract role request details
        const requestId = newRequest.requestId.S;
        const userId = newRequest.userId.S;
        const email = newRequest.email.S;
        const requestedRole = newRequest.requestedRole.S;
        const justification = newRequest.justification.S;
        const timestamp = newRequest.createdAt.S;
        
        // Format email content
        const emailParams = {
          Destination: {
            ToAddresses: [ADMIN_EMAIL],
          },
          Message: {
            Body: {
              Html: {
                Charset: "UTF-8",
                Data: `
                  <h2>New Role Request</h2>
                  <p>A new role request has been submitted and requires your review.</p>
                  <h3>Request Details:</h3>
                  <ul>
                    <li><strong>Request ID:</strong> ${requestId}</li>
                    <li><strong>User ID:</strong> ${userId}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Requested Role:</strong> ${requestedRole}</li>
                    <li><strong>Submitted:</strong> ${new Date(timestamp).toLocaleString()}</li>
                  </ul>
                  <h3>Justification:</h3>
                  <p>${justification}</p>
                  <p>Please log in to the <a href="https://yourdomain.com/role-requests.html">Role Requests</a> page to review this request.</p>
                `
              },
              Text: {
                Charset: "UTF-8",
                Data: `
                  New Role Request
                  
                  A new role request has been submitted and requires your review.
                  
                  Request Details:
                  - Request ID: ${requestId}
                  - User ID: ${userId}
                  - Email: ${email}
                  - Requested Role: ${requestedRole}
                  - Submitted: ${new Date(timestamp).toLocaleString()}
                  
                  Justification:
                  ${justification}
                  
                  Please log in to the Role Requests page to review this request.
                `
              }
            },
            Subject: {
              Charset: "UTF-8",
              Data: `New Role Request from ${email}`
            }
          },
          Source: SENDER_EMAIL
        };
        
        // Send email using SES
        const command = new SendEmailCommand(emailParams);
        const response = await sesClient.send(command);
        
        console.log("Email sent successfully:", response);
      } catch (error) {
        console.error("Error sending email notification:", error);
      }
    }
  }
  
  return { status: "Success" };
};