const AWS = require('aws-sdk');

exports.initiateAuth = function (username, password) {
    var params = {
        accessKeyId : process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    };
    var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else console.log(data);
    });

    params = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthParameters: {
            "USERNAME" : username,
            "PASSWORD" : password
        }
    };

    return new Promise(function(resolve, reject) {
        // Do async job
        cognitoidentityserviceprovider.initiateAuth(params, function(err, data) {
            if (err){ 
                console.log(err, err.stack);
                reject(err);
            }else{ 
                resolve(data);
            }
        });
    })

}


