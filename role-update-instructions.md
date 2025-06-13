# How to Update a User's Role

This document explains how to update a user's role from Student to Faculty Member in the IC CMS system.

## Using the User Management Interface

1. Log in as an Application Admin
2. Navigate to the User Management page
3. Find the student whose role you want to change
4. Click the "View" button next to their name
5. In the modal that appears, change their role from "Student" to "Faculty Member"
6. Click "Save Changes"
7. Wait for the confirmation message that the role was updated successfully

## What Happens Behind the Scenes

When you update a user's role through the User Management interface:

1. The system updates the user's role in the DynamoDB Users table
2. The system also updates the user's `custom:role` attribute in Amazon Cognito
3. This ensures that the role is consistent across both systems

## Troubleshooting

If the role update doesn't seem to take effect:

1. Ask the user to sign out and sign back in
2. This will refresh their authentication token with the new role information
3. If the issue persists, check the browser console for any error messages
4. Contact the system administrator if you need further assistance

## Technical Details

The role update process uses a Lambda function (`update-user-role`) that:

1. Updates the role in the DynamoDB Users table
2. Finds the user in Cognito by their user ID
3. Updates the user's custom:role attribute in Cognito
4. Returns a success message when both updates are complete

This ensures that the role is consistent across both the database and the authentication system.