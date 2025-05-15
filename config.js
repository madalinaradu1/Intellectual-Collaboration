/*global ICApp AmazonCognitoIdentity AWSCognito*/

var ICApp = window.ICApp || {};

(function scopeWrapper($) {
    var signinUrl = '/signin.html';

    // 🔐 Cognito Configuration for "IC" User Pool
    var poolData = {
        UserPoolId: 'us-east-1_JHnm7JteW',
        ClientId: '6m2e6sh0hbnqtp0cm8b9nrvaiv'
    };
    var region = 'us-east-1';

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    if (typeof AWSCognito !== 'undefined') {
        AWSCognito.config.region = region;
    }

    ICApp.signOut = function signOut() {
        userPool.getCurrentUser().signOut();
    };

    ICApp.authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    resolve(null);
                } else {
                    resolve(session.getIdToken().getJwtToken());
                }
            });
        } else {
            resolve(null);
        }
    });

    /*
     * Cognito User Pool functions
     */

    function register(email, password, onSuccess, onFailure) {
        var dataEmail = {
            Name: 'email',
            Value: email
        };
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

        userPool.signUp(toUsername(email), password, [attributeEmail], null,
            function signUpCallback(err, result) {
                if (!err) {
                    onSuccess(result);
                } else {
                    onFailure(err);
                }
            }
        );
    }

    function signin(email, password, onSuccess, onFailure) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: toUsername(email),
            Password: password
        });

        var cognitoUser = createCognitoUser(email);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                onSuccess(result); // No MFA challenge, sign-in complete
            },
            onFailure: onFailure,
            mfaSetup: function () {
                sessionStorage.setItem('mfaUserEmail', email);
                window.location.href = 'verify-mfa.html';
            },
            totpRequired: function () {
                var code = prompt("Enter your 6-digit MFA code from your Authenticator App:");
                cognitoUser.sendMFACode(code, this, 'SOFTWARE_TOKEN_MFA');
            }
        });
    }

    function verify(email, code, onSuccess, onFailure) {
        createCognitoUser(email).confirmRegistration(code, true, function confirmCallback(err, result) {
            if (!err) {
                onSuccess(result);
            } else {
                onFailure(err);
            }
        });
    }

    function createCognitoUser(email) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: toUsername(email),
            Pool: userPool
        });
    }

    function toUsername(email) {
        return email.replace('@', '-at-');
    }

    /*
     *  Event Handlers
     */

    $(function onDocReady() {
        $('#signinForm').submit(handleSignin);
        $('#registrationForm').submit(handleRegister);
        $('#verifyForm').submit(handleVerify);
    });

    function handleSignin(event) {
        var email = $('#emailInputSignin').val();
        var password = $('#passwordInputSignin').val();
        event.preventDefault();
        signin(email, password,
            function signinSuccess() {
                console.log('✅ Successfully Logged In');
                window.location.href = 'index.html';
            },
            function signinError(err) {
                alert(err.message || JSON.stringify(err));
            }
        );
    }

    function handleRegister(event) {
        var email = $('#emailInputRegister').val();
        var password = $('#passwordInputRegister').val();
        var password2 = $('#password2InputRegister').val();

        var onSuccess = function registerSuccess(result) {
            var cognitoUser = result.user;
            console.log('🆕 Registered user:', cognitoUser.getUsername());
            alert('Registration successful. Check your email for the verification code.');
            window.location.href = 'verify.html';
        };

        var onFailure = function registerFailure(err) {
            alert(err.message || JSON.stringify(err));
        };

        event.preventDefault();

        if (password === password2) {
            register(email, password, onSuccess, onFailure);
        } else {
            alert('Passwords do not match');
        }
    }

    function handleVerify(event) {
        var email = $('#emailInputVerify').val();
        var code = $('#codeInputVerify').val();
        event.preventDefault();
        verify(email, code,
            function verifySuccess(result) {
                console.log('✅ Verification successful:', result);
                alert('Verification complete. Redirecting to login.');
                window.location.href = signinUrl;
            },
            function verifyError(err) {
                alert(err.message || JSON.stringify(err));
            }
        );
    }
}(jQuery));
