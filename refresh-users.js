// Simple script to force refresh user data
document.addEventListener('DOMContentLoaded', function() {
  // Add click handler to refresh button if it exists
  const refreshButton = document.getElementById('refreshUsers');
  if (refreshButton) {
    refreshButton.addEventListener('click', function() {
      // Add a timestamp parameter to force a fresh request
      const timestamp = new Date().getTime();
      window.location.href = `user-management.html?refresh=${timestamp}`;
    });
  }
});