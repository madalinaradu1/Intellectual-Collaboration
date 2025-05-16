// cognito-auth.js

Amplify.configure({
  Auth: {
    region: _config.cognito.region,
    userPoolId: _config.cognito.userPoolId,
    userPoolWebClientId: _config.cognito.userPoolClientId
  }
});

// Sign Up Handler
async function handleRegister(event) {
  event.preventDefault();

  const email = document.getElementById('emailInputRegister').value;
  const password = document.getElementById('passwordInputRegister').value;
  const password2 = document.getElementById('password2InputRegister').value;

  if (password !== password2) {
    showMessage('signup-status', 'Passwords do not match');
    return;
  }

  try {
    await Amplify.Auth.signUp({
      username: email,
      password,
      attributes: { email }
    });

    showMessage('signup-status', '✅ Registration successful. Check your email for a verification code.');
    setTimeout(() => {
      window.location.href = 'verify.html';
    }, 2000);
  } catch (error) {
    console.error(error);
    showMessage('signup-status', error.message || 'Registration failed');
  }
}

// Confirm Email Verification Code
async function handleVerify(event) {
  event.preventDefault();

  const email = document.getElementById('emailInputVerify').value;
  const code = document.getElementById('codeInputVerify').value;

  try {
    await Amplify.Auth.confirmSignUp(email, code);
    showMessage('verify-status', '✅ Verification successful. Redirecting...');
    setTimeout(() => {
      window.location.href = 'signin.html';
    }, 2000);
  } catch (error) {
    console.error(error);
    showMessage('verify-status', error.message || 'Verification failed');
  }
}

// Sign In + MFA Handler
async function handleSignin(event) {
  event.preventDefault();

  const email = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const user = await Amplify.Auth.signIn(email, password);

    if (user.challengeName === 'MFA_SETUP') {
      // First-time MFA setup
      window.location.href = 'verify-mfa.html';
    } else if (user.challengeName === 'SOFTWARE_TOKEN_MFA') {
      const code = prompt('Enter your 6-digit MFA code:');
      await Amplify.Auth.confirmSignIn(user, code, 'SOFTWARE_TOKEN_MFA');
      window.location.href = 'index.html';
    } else {
      // No MFA, login successful
      window.location.href = 'index.html';
    }
  } catch (error) {
    console.error(error);
    showMessage('error-message', error.message || 'Login failed.');
  }
}

// Utility function to show messages
function showMessage(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = message;
}

// Bind handlers when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registrationForm');
  const verifyForm = document.getElementById('verifyForm');
  const signinForm = document.getElementById('signinForm');

  if (registerForm) registerForm.addEventListener('submit', handleRegister);
  if (verifyForm) verifyForm.addEventListener('submit', handleVerify);
  if (signinForm) signinForm.addEventListener('submit', handleSignin);
});
