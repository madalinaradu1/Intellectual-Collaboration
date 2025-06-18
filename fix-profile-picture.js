// Script to fix profile picture loading issues
document.addEventListener('DOMContentLoaded', function() {
  // Function to load user profile picture from API
  async function loadProfilePicture() {
    try {
      // Wait for Amplify to be available
      if (typeof window.Amplify === 'undefined' && typeof window.aws_amplify !== 'undefined') {
        window.Amplify = window.aws_amplify.Amplify;
      }
      
      if (typeof window.Amplify === 'undefined') {
        console.error("Amplify not available yet");
        return;
      }
      
      // Get session and token
      const session = await Amplify.Auth.currentSession();
      const idToken = session.getIdToken().getJwtToken();
      
      // Fetch user data from API
      const response = await fetch(`${window._config.api.invokeUrl}/cms/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': idToken,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log("User data loaded:", userData);
        
        // Update profile picture if available
        if (userData.profilePicture) {
          console.log("Setting profile picture from API:", userData.profilePicture);
          const profileImage = document.getElementById('profileImage');
          if (profileImage) {
            profileImage.src = userData.profilePicture;
          }
        }
      }
    } catch (error) {
      console.error("Error loading profile picture:", error);
    }
  }
  
  // Try to load profile picture after a short delay
  setTimeout(loadProfilePicture, 1000);
});