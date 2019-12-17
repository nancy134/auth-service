const AWS = require('aws-sdk');

function getCognitoIdentityServiceProvider() {
    var params = {
        accessKeyId : process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    };
    return new AWS.CognitoIdentityServiceProvider(params);


}
exports.signUp = function (username, password) {
    var cognitoIdentityServiceProvider = getCognitoIdentityServiceProvider();

    params = {
        ClientId: process.env.COGNITO_CLIENT_ID,
        Password: password,
        Username: username
    };

    return cognitoIdentityServiceProvider.signUp(params).promise();
}
exports.initiateAuth = function (username, password) {
    var cognitoIdentityServiceProvider = getCognitoIdentityServiceProvider(); 

    params = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthParameters: {
            "USERNAME" : username,
            "PASSWORD" : password
        }
    };
    
    return cognitoIdentityServiceProvider.initiateAuth(params).promise();
}
exports.confirmSignUp = function(username, code){
    var cognitoIdentityServiceProvider = getCognitoIdentityServiceProvider();

    params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      ConfirmationCode: code,
      Username: username
    };

    return cognitoIdentityServiceProvider.confirmSignUp(params).promise(); 
}

