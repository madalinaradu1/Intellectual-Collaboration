// Amplify configuration
if (typeof _config !== 'undefined') {
  const awsConfig = {
    Auth: {
      region: _config.cognito.region,
      userPoolId: _config.cognito.userPoolId,
      userPoolWebClientId: _config.cognito.userPoolClientId
    },
    API: {
      endpoints: [
        {
          name: "icApi",
          endpoint: _config.api.invokeUrl
        }
      ]
    }
  };

  // Export for use with Amplify
  window.awsConfig = awsConfig;
} else {
  console.error("_config is not defined in amplify-config.js");
}