// role-notifications.js
// Simple notification system for role requests without using SES

// Function to check for new role requests
async function checkForNewRoleRequests() {
  try {
    const session = await Amplify.Auth.currentSession();
    const idToken = session.getIdToken().getJwtToken();
    
    // Get user role from token
    const userRole = session.getIdToken().payload['custom:role'] || 'Guest';
    const cognitoGroups = session.getIdToken().payload['cognito:groups'] || [];
    const isAdmin = userRole === 'ApplicationAdmin' || cognitoGroups.includes('ApplicationAdmin');
    
    // Only admins should check for role requests
    if (!isAdmin) return;
    
    // Fetch all pending role requests
    const response = await fetch(`${_config.api.invokeUrl}/cms/role-requests`, {
      method: 'GET',
      headers: {
        'Authorization': idToken,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const requests = await response.json();
    const pendingRequests = requests.filter(req => req.status === 'Pending');
    
    // Update notification badge
    updateNotificationBadge(pendingRequests.length);
    
    // Show browser notification if there are pending requests
    if (pendingRequests.length > 0) {
      showBrowserNotification(pendingRequests.length);
    }
    
    return pendingRequests.length;
  } catch (err) {
    console.error("Error checking for role requests:", err);
    return 0;
  }
}

// Function to update notification badge on navbar
function updateNotificationBadge(count) {
  const roleRequestsNav = document.getElementById('roleRequestsNav');
  if (!roleRequestsNav) return;
  
  // Remove existing badge if any
  const existingBadge = roleRequestsNav.querySelector('.badge');
  if (existingBadge) {
    existingBadge.remove();
  }
  
  // Add new badge if count > 0
  if (count > 0) {
    const badge = document.createElement('span');
    badge.className = 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger';
    badge.style.fontSize = '0.7rem';
    badge.textContent = count;
    roleRequestsNav.style.position = 'relative';
    roleRequestsNav.appendChild(badge);
  }
}

// Function to show browser notification
function showBrowserNotification(count) {
  // Check if browser supports notifications
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return;
  }
  
  // Check if permission is already granted
  if (Notification.permission === "granted") {
    createNotification(count);
  } 
  // Otherwise, ask for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        createNotification(count);
      }
    });
  }
}

// Function to create the actual notification
function createNotification(count) {
  const notification = new Notification("Role Request Notification", {
    body: `You have ${count} pending role request${count > 1 ? 's' : ''} to review.`,
    icon: "favicon.ico"
  });
  
  notification.onclick = function() {
    window.open("role-requests.html", "_blank");
  };
}

// Initialize periodic checking
function initRoleRequestNotifications() {
  // Check immediately on load
  checkForNewRoleRequests();
  
  // Then check periodically (every 2 minutes)
  setInterval(checkForNewRoleRequests, 2 * 60 * 1000);
}

// Export functions
window.roleNotifications = {
  init: initRoleRequestNotifications,
  check: checkForNewRoleRequests
};