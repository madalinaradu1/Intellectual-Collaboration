// Script to update profile image placeholder
document.addEventListener('DOMContentLoaded', function() {
  // Check if profile image exists and update to use no-profile.png as default
  const profileImage = document.getElementById('profileImage');
  if (profileImage) {
    // Set default image source to no-profile.png
    if (profileImage.src.includes('data:image/png;base64')) {
      profileImage.src = 'no-profile.png';
    }
  }
});