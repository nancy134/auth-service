const AWS = require('aws-sdk');

function getCognitoIdentityServiceProvider() {
    var params = {
        accessKeyId : process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    };
    return new AWS.CognitoIdentityServiceProvider(params);


}
exports.signUp = function (username, password, cognitoClientId) {
    var cognitoIdentityServiceProvider = getCognitoIdentityServiceProvider();

    params = {
        ClientId: cognitoClientId, 
        Password: password,
        Username: username
    };

    return cognitoIdentityServiceProvider.signUp(params).promise();
}
exports.initiateAuth = function (username, password, cognitoClientId) {
    var cognitoIdentityServiceProvider = getCognitoIdentityServiceProvider(); 

    params = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: cognitoClientId,
        AuthParameters: {
            "USERNAME" : username,
            "PASSWORD" : password
        }
    };
    
    return cognitoIdentityServiceProvider.initiateAuth(params).promise();
}
exports.confirmSignUp = function(username, code, cognitoClientId){
    var cognitoIdentityServiceProvider = getCognitoIdentityServiceProvider();

    params = {
      ClientId: cognitoClientId,
      ConfirmationCode: code,
      Username: username
    };

    return cognitoIdentityServiceProvider.confirmSignUp(params).promise(); 
}

exports.listUserPools = function(){
    var cognitoIdentityServiceProvider = getCognitoIdentityServiceProvider();

    params = {
        MaxResults: '25'
    };

    return cognitoIdentityServiceProvider.listUserPools(params).promise();
}

exports.describeUserPool = function(userPoolId){
    var cognitoIdentityServiceProvider = getCognitoIdentityServiceProvider();

    params = {
        UserPoolId: userPoolId
    };

    return cognitoIdentityServiceProvider.describeUserPool(params).promise();
}

exports.listUserPoolClients = function(userPoolId){
     var cognitoIdentityServiceProvider = getCognitoIdentityServiceProvider();

     params = {
         UserPoolId: userPoolId
     }

     return cognitoIdentityServiceProvider.listUserPoolClients(params).promise();
}

