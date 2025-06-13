// Function to update a user's role in both Cognito and the database
async function updateUserRole(userId, newRole) {
  try {
    const session = await Amplify.Auth.currentSession();
    const idToken = session.getIdToken().getJwtToken();
    
    // Show loading message
    const statusEl = document.getElementById('userStatus');
    statusEl.textContent = "Updating user role...";
    statusEl.classList.add('alert-info');
    statusEl.classList.remove('d-none', 'alert-danger', 'alert-success');
    
    // Call the API to update the user's role in both Cognito and the database
    const response = await fetch(`${_config.api.invokeUrl}/cms/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': idToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: newRole
      }),
      // Remove credentials: 'include' to avoid CORS issues
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`Failed to update role: ${errorText}`);
    }
    
    // Show success message
    statusEl.textContent = `User role successfully updated to ${newRole}!`;
    statusEl.classList.add('alert-success');
    statusEl.classList.remove('alert-info', 'alert-danger');
    
    return true;
  } catch (err) {
    console.error("Error updating user role:", err);
    const statusEl = document.getElementById('userStatus');
    statusEl.textContent = `Error: ${err.message}`;
    statusEl.classList.add('alert-danger');
    statusEl.classList.remove('alert-info', 'alert-success');
    return false;
  }
}