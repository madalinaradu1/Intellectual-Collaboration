// post-author-handler.js
// Handles post author display without requiring user API access

// Function to format author name from available data
function formatAuthorName(post) {
  // If we have author data with first and last name, use it
  if (post.AuthorData && post.AuthorData.firstName && post.AuthorData.lastName) {
    return `${post.AuthorData.firstName} ${post.AuthorData.lastName}`;
  }
  
  // If we have an email, extract name from it
  if (post.AuthorEmail) {
    return formatNameFromEmail(post.AuthorEmail);
  }
  
  // If we have an author ID that looks like an email
  if (typeof post.Author === 'string' && post.Author.includes('@')) {
    return formatNameFromEmail(post.Author);
  }
  
  // Fallback to author ID
  return post.Author || 'Unknown Author';
}

// Function to format name from email
function formatNameFromEmail(email) {
  if (!email) return 'Unknown User';
  
  const parts = email.split('@');
  if (parts.length < 1) return 'Unknown User';
  
  // Convert username part to title case (e.g., john.doe -> John Doe)
  return parts[0]
    .replace(/\./g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

// Export functions
window.postAuthorHandler = {
  formatAuthorName,
  formatNameFromEmail
};