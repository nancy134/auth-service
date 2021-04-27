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

exports.refreshToken = function(refreshToken, cognitoClientId){
    var cognitoIdentityServiceProvider = getCognitoIdentityServiceProvider();

    var params = {
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: cognitoClientId,
        AuthParameters: {
            "REFRESH_TOKEN": refreshToken
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

exports.resendConfirmationCode = function(username, cognitoClientId){
    var cognitoIdentityServiceProvider = getCognitoIdentityServiceProvider();

    params = {
      ClientId: cognitoClientId,
      Username: username
    };

    return cognitoIdentityServiceProvider.resendConfirmationCode(params).promise();
}

exports.forgotPassword = function(username, cognitoClientId){
    var cognitoIdentityServiceProvider = getCognitoIdentityServiceProvider();
    var params = {
        ClientId: cognitoClientId,
        Username: username
    };
    return cognitoIdentityServiceProvider.forgotPassword(params).promise();
}

exports.confirmForgotPassword = function(code, password, username, cognitoClientId){
    var cognitoIdentityServiceProvider = getCognitoIdentityServiceProvider();
    var params = {
        ClientId: cognitoClientId,
        ConfirmationCode: code,
        Password: password,
        Username: username
    };
    return cognitoIdentityServiceProvider.confirmForgotPassword(params).promise();
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

exports.adminDeleteUser = function(params){
    var cognitoIdentifyServiceProvider = getCognitoIdentityServiceProvider();
    return cognitoIdentifyServiceProvider.adminDeleteUser(params).promise();
}

exports.listUsers = function(params){
    var cognitoIdentifyServiceProvider = getCognitoIdentityServiceProvider();

    return cognitoIdentifyServiceProvider.listUsers(params).promise();
}

exports.deleteUser = function(userPoolId, email){
    return new Promise(function(resolve, reject){
        var params = {
            UserPoolId: userPoolId,
            AttributesToGet: ['email'],
            Filter: "email = \""+email+"\""
        };
        module.exports.listUsers(params).then(function(result){
            if (result.Users.length > 0){
                params = {
                    UserPoolId: userPoolId,
                    Username: result.Users[0].Username
                };
                module.exports.adminDeleteUser(params).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                resolve(result);
            }
        }).catch(function(err){
            reject(err);
        });
    });
}

