const axios = require('axios');
const utilities = require('./utilities');

// Demo
//API Key (client_id): bqt7g0oqvo1hf4vv8ukrrb6ca
//Secret (client_secret): 3zbtc4pqw0u79b0bdl3ukdjwj
//Redirect URI (redirect_uri): https://sparkplatform.com/oauth2/callback

// App
//f199xn72zbpo1bhreekydm4g4
//6c77qp7i57jmssuw6xd4fugit

//https://sparkplatform.com/openid/authorize?client_id=1234&scope=openid&response_type=code&redirect_uri=https://example.com/callback&state=abcdefgh&nonce=zyxwvuts

exports.getAuthorizationUrl = function(clientId){
    return new Promise(function(resolve, reject){
        var baseUrl = "https://sparkplatform.com/openid/authorize";
        var authUrl = 
            baseUrl + 
            "?client_id=" + 
            clientId +
            "&scope=openid&response_type=code&redirect_uri=";

        resolve(authUrl); 
    });
}

exports.getAccessToken = function(body){
    return new Promise(function(resolve, reject){
        var baseUrl = "https://sparkplatform.com/openid/token";
        var data = {
            client_id: body.clientId,
            client_secret: process.env.SPARK_CLIENT_SECRET,
            grant_type: "authorization_code",
            code: body.code,
            redirect_uri: body.redirect_uri
        };
        console.log(body);
        var options = {
           url: baseUrl,
           method: 'POST',
           data: data
        };
        axios(options).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}
