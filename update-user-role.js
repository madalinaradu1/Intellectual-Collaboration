// update-user-role.js
// Function to update a user's role in Cognito and DynamoDB

// Function to update user role
async function updateUserRole(userId, newRole, firstName, lastName) {
  try {
    // Get auth token
    const session = await Amplify.Auth.currentSession();
    const idToken = session.getIdToken().getJwtToken();
    
    // Call API to update user role
    const response = await fetch(`${_config.api.invokeUrl}/cms/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': idToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: newRole,
        firstName: firstName || '',
        lastName: lastName || ''
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update user role: ${response.status} - ${errorText}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating role for user ${userId}:`, error);
    throw error;
  }
}

// Export function
window.userRoleUtils = {
  updateUserRole
};