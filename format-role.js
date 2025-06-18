// Simple utility to format role names with spaces
function formatRoleName(role) {
  if (!role) return '';
  // Add a space before each capital letter and trim any extra spaces
  return role.replace(/([A-Z])/g, ' $1').trim();
}

// Make available globally
window.formatUtils = {
  formatRoleName
};