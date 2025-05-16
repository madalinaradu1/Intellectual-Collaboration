// cognito-auth.js (using Cognito Identity SDK)

var poolData = {
  UserPoolId: _config.cognito.userPoolId,
  ClientId: _config.cognito.userPoolClientId
};

var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Sign Up Handler
function handleRegister(event) {
  event.preventDefault();

  var email = $('#emailInputRegister').val();
  var password = $('#passwordInputRegister').val();
  var password2 = $('#password2InputRegister').val();

  if (password !== password2) {
    showMessage('signup-status', 'Passwords do not match');
    return;
  }

  var dataEmail = {
    Name: 'email',
    Value: email
  };

  var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

  userPool.signUp(email, password, [attributeEmail], null, function(err, result) {
    if (err) {
      showMessage('signup-status', err.message || 'Registration failed');
    } else {
      showMessage('signup-status', '✅ Registered! Check your email for a verification code.');
      setTimeout(() => window.location.href = 'verify.html', 2000);
    }
  });
}

// Confirm Email Verification Code
function handleVerify(event) {
  event.preventDefault();

  var email = $('#emailInputVerify').val();
  var code = $('#codeInputVerify').val();

  var userData = {
    Username: email,
    Pool: userPool
  };

  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.confirmRegistration(code, true, function(err, result) {
    if (err) {
      showMessage('verify-status', err.message || 'Verification failed');
    } else {
      showMessage('verify-status', '✅ Verification successful. Redirecting...');
      setTimeout(() => window.location.href = 'signin.html', 2000);
    }
  });
}

// Sign In + MFA
function handleSignin(event) {
  event.preventDefault();

  var email = $('#username').val();
  var password = $('#password').val();

  var authData = {
    Username: email,
    Password: password
  };

  var authDetails = new AmazonCognitoIdentity.AuthenticationDetails(authData);

  var userData = {
    Username: email,
    Pool: userPool
  };

  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authDetails, {
    onSuccess: function(result) {
      window.location.href = 'index.html';
    },
    onFailure: function(err) {
      showMessage('error-message', err.message || 'Login failed.');
    },
    mfaRequired: function(codeDeliveryDetails) {
      var code = prompt('Enter your 6-digit MFA code:');
      cognitoUser.sendMFACode(code, this);
    }
  });
}

// Show messages
function showMessage(id, msg) {
  $('#' + id).text(msg);
}

// Bind forms
$(document).ready(function() {
  $('#registrationForm').on('submit', handleRegister);
  $('#verifyForm').on('submit', handleVerify);
  $('#signinForm').on('submit', handleSignin);
});
