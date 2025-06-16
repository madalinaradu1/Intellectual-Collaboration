// fetch-user-details.js
// Helper functions to fetch user details from Cognito/DynamoDB

// Cache for user details to avoid repeated API calls
const userCache = {};

// Function to fetch user details by user ID
async function fetchUserDetails(userId) {
  try {
    // Return from cache if available
    if (userCache[userId]) {
      console.log(`Using cached user details for ${userId}`);
      return userCache[userId];
    }
    
    // Get auth token
    const session = await Amplify.Auth.currentSession();
    const idToken = session.getIdToken().getJwtToken();
    
    // Fetch user details from API
    const response = await fetch(`${_config.api.invokeUrl}/cms/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': idToken,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user details: ${response.status}`);
    }
    
    const userData = await response.json();
    
    // Cache the result
    userCache[userId] = userData;
    
    return userData;
  } catch (error) {
    console.error(`Error fetching user details for ${userId}:`, error);
    return null;
  }
}

// Function to get formatted user name
function formatUserName(userData) {
  if (!userData) return 'Unknown User';
  
  if (userData.firstName && userData.lastName) {
    return `${userData.firstName} ${userData.lastName}`;
  } else if (userData.firstName) {
    return userData.firstName;
  } else if (userData.email) {
    return getDisplayNameFromEmail(userData.email);
  } else {
    return 'Unknown User';
  }
}

// Function to get display name from email
function getDisplayNameFromEmail(email) {
  if (!email) return 'Unknown User';
  const parts = email.split('@');
  if (parts.length < 1) return 'Unknown User';
  
  // Convert username part to title case (e.g., john.doe -> John Doe)
  return parts[0]
    .replace(/\./g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

// Export functions
window.userUtils = {
  fetchUserDetails,
  formatUserName,
  getDisplayNameFromEmail
};