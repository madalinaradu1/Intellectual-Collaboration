// Amplify configuration
if (typeof _config !== 'undefined') {
  const awsConfig = {
    Auth: {
      // Required configuration
      region: _config.cognito.region,
      userPoolId: _config.cognito.userPoolId,
      userPoolWebClientId: _config.cognito.userPoolClientId,
      
      // Additional required settings
      authenticationFlowType: 'USER_SRP_AUTH',
      mandatorySignIn: true
    },
    API: {
      endpoints: [
        {
          name: "icApi",
          endpoint: _config.api.invokeUrl,
          region: _config.cognito.region,
          custom_header: async () => {
            return { 
              Authorization: (await Amplify.Auth.currentSession()).getIdToken().getJwtToken()
            }
          }
        }
      ]
    }
  };

  // Export for use with Amplify
  window.awsConfig = awsConfig;
} else {
  console.error("_config is not defined in amplify-config.js");
}