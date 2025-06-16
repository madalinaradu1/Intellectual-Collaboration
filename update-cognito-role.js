// Direct Cognito role update script
// This script provides a function to directly update a user's role in Cognito

// Function to update a user's role in Cognito
async function updateCognitoRole(userId, email, newRole) {
  try {
    // Get auth token
    const session = await Amplify.Auth.currentSession();
    const idToken = session.getIdToken().getJwtToken();
    
    // Call API to update Cognito role directly
    const response = await fetch(`${_config.api.invokeUrl}/cms/users/${userId}/cognito-role`, {
      method: 'PUT',
      headers: {
        'Authorization': idToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        role: newRole
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update Cognito role: ${response.status} - ${errorText}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating Cognito role for user ${userId}:`, error);
    throw error;
  }
}

// Export function
window.cognitoUtils = {
  updateCognitoRole
};