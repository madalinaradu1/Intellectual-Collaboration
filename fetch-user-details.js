// fetch-user-details.js
// Helper functions to fetch user details from Cognito/DynamoDB

// Cache for user details to avoid repeated API calls
const userCache = {};

// Function to fetch user details by user ID
async function fetchUserDetails(userId, email) {
  try {
    // Return from cache if available
    if (userCache[userId]) {
      console.log(`Using cached user details for ${userId}`);
      return userCache[userId];
    }
    
    // If we don't have a direct API endpoint for user ID, use the email-based approach
    // Create a basic user object with the email
    if (email) {
      const basicUserData = {
        email: email,
        firstName: null,
        lastName: null
      };
      
      // Cache this basic data
      userCache[userId] = basicUserData;
      return basicUserData;
    }
    
    return null;
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