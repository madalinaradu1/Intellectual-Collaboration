
// Configure Amplify
Amplify.configure({
  Auth: {
    region: _config.cognito.region,
    userPoolId: _config.cognito.userPoolId,
    userPoolWebClientId: _config.cognito.userPoolClientId
  }
});

// Sign In Handler
async function handleSignin(event) {
  event.preventDefault();
  console.log("🔑 handleSignin() called");

  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    console.log("🔍 Attempting sign in for:", email);
    const user = await Amplify.Auth.signIn(email, password);
    console.log("✅ Sign-in successful:", user);

    if (user.challengeName === 'MFA_SETUP') {
      console.log("⚠️ MFA Setup required");
      window.location.href = 'verify-mfa.html';
    } else if (user.challengeName === 'SOFTWARE_TOKEN_MFA') {
      console.log("🔐 MFA challenge: SOFTWARE_TOKEN_MFA");
      const code = prompt("Enter your 6-digit MFA code:");
      await Amplify.Auth.confirmSignIn(user, code, 'SOFTWARE_TOKEN_MFA');
      window.location.href = 'index.html';
    } else {
      console.log("🎉 Redirecting to index.html");
      window.location.href = 'index.html';
    }
  } catch (err) {
    console.error("❌ Sign-in error:", err);
    showMessage('error-message', err.message || 'Login failed.');
  }
}


// Sign Up Handler
async function handleRegister(event) {
  event.preventDefault();
  const email = document.getElementById("emailInputRegister").value;
  const password = document.getElementById("passwordInputRegister").value;
  const confirm = document.getElementById("password2InputRegister").value;

  if (password !== confirm) {
    return showMessage('signup-status', '❌ Passwords do not match');
  }

  try {
    await Amplify.Auth.signUp({
      username: email,
      password,
      attributes: { email }
    });

    showMessage('signup-status', '✅ Registration successful. Check your email for the verification code.');
    setTimeout(() => window.location.href = 'verify.html', 2000);
  } catch (err) {
    console.error(err);
    showMessage('signup-status', err.message || 'Registration failed.');
  }
}

// Confirm Email Verification
async function handleVerify(event) {
  event.preventDefault();
  const email = document.getElementById("emailInputVerify").value;
  const code = document.getElementById("codeInputVerify").value;

  try {
    await Amplify.Auth.confirmSignUp(email, code);
    showMessage('verify-status', '✅ Verification successful. Redirecting...');
    setTimeout(() => window.location.href = 'signin.html', 2000);
  } catch (err) {
    console.error(err);
    showMessage('verify-status', err.message || 'Verification failed.');
  }
}

// Utility to Show Messages
function showMessage(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

// DOM Event Listeners
window.addEventListener("DOMContentLoaded", () => {
  const signinForm = document.getElementById("signinForm");
  const registerForm = document.getElementById("registrationForm");
  const verifyForm = document.getElementById("verifyForm");

  if (signinForm) signinForm.addEventListener("submit", handleSignin);
  if (registerForm) registerForm.addEventListener("submit", handleRegister);
  if (verifyForm) verifyForm.addEventListener("submit", handleVerify);
});
