// Script to update user's parent group to DC Network
document.addEventListener('DOMContentLoaded', function() {
  // Add a button to the profile page to set parent group
  const securitySection = document.querySelector('.profile-section:nth-of-type(2)');
  
  if (securitySection) {
    const setParentGroupBtn = document.createElement('button');
    setParentGroupBtn.className = 'btn btn-outline-primary w-100 mt-3';
    setParentGroupBtn.id = 'setParentGroupBtn';
    setParentGroupBtn.textContent = 'Set DC Network as Parent Group';
    
    securitySection.appendChild(setParentGroupBtn);
    
    // Add event listener
    setParentGroupBtn.addEventListener('click', async function() {
      try {
        if (typeof Amplify === 'undefined') {
          throw new Error("AWS Amplify is not loaded");
        }
        
        const session = await Amplify.Auth.currentSession();
        const idToken = session.getIdToken().getJwtToken();
        
        // Update user profile with DC Network as parent group
        const response = await fetch(`${_config.api.invokeUrl}/cms/users/me`, {
          method: 'PUT',
          headers: {
            'Authorization': idToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            parentGroup: 'DC Network'
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        alert('Parent group set to DC Network. You can now access the Student Dashboard.');
        
        // Reload the page to reflect changes
        window.location.reload();
      } catch (err) {
        console.error("Error setting parent group:", err);
        alert(`Error: ${err.message}`);
      }
    });
  }
});