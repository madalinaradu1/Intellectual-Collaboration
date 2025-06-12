// Function to handle sign out
async function handleSignOut() {
  try {
    await Amplify.Auth.signOut();
    console.log("User signed out successfully");
    window.location.href = "login-selection.html";
  } catch (error) {
    console.error("Error signing out:", error);
    alert("Error signing out. Please try again.");
  }
}

// Function to update navigation based on authentication state
function updateNavigation(isAuthenticated) {
  if (isAuthenticated) {
    document.getElementById('navSignInLink').style.display = 'none';
    document.getElementById('navSignOutLink').style.display = '';
    document.getElementById('navProfileLink').style.display = '';
  } else {
    document.getElementById('navSignInLink').style.display = '';
    document.getElementById('navSignOutLink').style.display = 'none';
    document.getElementById('navProfileLink').style.display = 'none';
  }
}

// Function to add navigation bar to the page
function addNavigationBar() {
  const navbarHtml = `
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="index.html">IC CMS</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse show" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <a class="nav-link" href="index.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="group-management.html" data-requires-role="ApplicationAdmin,GroupAdmin,GroupOfficer">Groups</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="user-management.html" data-requires-role="ApplicationAdmin">Users</a>
          </li>
          <li class="nav-item" id="roleRequestsNav">
            <a class="nav-link" href="role-requests.html">Role Requests</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="bulk-import.html" data-requires-role="ApplicationAdmin,GroupAdmin">Import Users</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="student-dashboard.html" data-requires-role="Student,ApplicationAdmin" data-requires-parent-group="DC Network">Student Dashboard</a>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="profile.html" id="navProfileLink">Profile</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="signin.html" id="navSignInLink">Sign In</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" id="navSignOutLink">Sign Out</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container-fluid mt-2 mb-3">
    <div class="row">
      <div class="col-md-3">
        <img src="IC_Logo.png" alt="IC Logo" class="img-fluid" style="max-height: 80px;">
      </div>
    </div>
  </div>
  `;
  
  // Insert navbar at the beginning of the body
  document.body.insertAdjacentHTML('afterbegin', navbarHtml);
  
  // Set up sign out button
  document.getElementById('navSignOutLink').addEventListener('click', function(e) {
    e.preventDefault();
    handleSignOut();
  });
  
  // We'll handle authentication check in the window.onload function
  updateNavigation(false);
}

// Call this function after the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // First add the navigation bar structure
  addNavigationBar();
  
  // Then try to configure Amplify if it's available
  window.addEventListener('load', function() {
    try {
      // Check if Amplify is available
      if (typeof window.aws_amplify !== 'undefined') {
        window.Amplify = window.aws_amplify.Amplify;
      }
      
      // Check if config is available
      if (typeof window.awsConfig !== 'undefined' && typeof Amplify !== 'undefined') {
        console.log("Configuring Amplify in navbar.js");
        Amplify.configure(window.awsConfig);
        
        // Now try to check authentication
        Amplify.Auth.currentAuthenticatedUser()
          .then(async (user) => {
            updateNavigation(true);
            
            // Get user role
            const session = await Amplify.Auth.currentSession();
            const idToken = session.getIdToken();
            let userRole = idToken.payload['custom:role'] || 'Guest';
            const cognitoGroups = idToken.payload['cognito:groups'] || [];
            
            if (cognitoGroups.includes('ApplicationAdmin')) {
              userRole = 'ApplicationAdmin';
            }
            
            console.log("Navbar - User role:", userRole);
            
            // Get parent group
            let parentGroup = idToken.payload['custom:parentGroup'] || '';
            console.log("Navbar - User role:", userRole, "Parent group:", parentGroup);
            
            // Handle Role Requests link visibility
            const roleRequestsNav = document.getElementById('roleRequestsNav');
            if (userRole === 'ApplicationAdmin') {
              roleRequestsNav.style.display = '';
              console.log("Showing Role Requests link for ApplicationAdmin");
            } else {
              roleRequestsNav.style.display = 'none';
              console.log("Hiding Role Requests link for non-admin users");
            }
            
            // Update role-based elements
            const roleElements = document.querySelectorAll('[data-requires-role]');
            roleElements.forEach(el => {
              const requiredRoles = el.dataset.requiresRole.split(',');
              
              // Check if user has any of the required roles
              const hasRequiredRole = requiredRoles.includes(userRole);
              
              // Special case for ApplicationAdmin and GroupAdmin - they should see all their elements
              const isAdmin = (userRole === 'ApplicationAdmin' || userRole === 'GroupAdmin');
              const isAdminElement = requiredRoles.includes('ApplicationAdmin') || requiredRoles.includes('GroupAdmin');
              
              // Check parent group restrictions
              const requiredParentGroups = el.dataset.requiresParentGroup ? el.dataset.requiresParentGroup.split(',') : [];
              const hasRequiredParentGroup = requiredParentGroups.length === 0 || requiredParentGroups.includes(parentGroup);
              
              if ((hasRequiredRole || (isAdmin && isAdminElement)) && hasRequiredParentGroup) {
                el.parentElement.style.display = '';
                console.log("Showing element for role:", userRole, "and parent group:", parentGroup, el);
              } else {
                el.parentElement.style.display = 'none';
              }
            });
          })
          .catch(() => {
            updateNavigation(false);
          });
      } else {
        console.log("Amplify or config not available in navbar.js");
        updateNavigation(false);
      }
    } catch (error) {
      console.error("Error in navbar.js:", error);
      updateNavigation(false);
    }
  });
});