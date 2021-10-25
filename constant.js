const axios = require('axios');
const utilities = require('./utilities');

exports.getAuthorizationUrl = function(clientId){
    return new Promise(function(resolve, reject){
        var baseUrl = "https://api.cc.email/v3/idfed";
        var authUrl = 
            baseUrl + 
            "?client_id=" + 
            clientId +
            "&scope=contact_data+campaign_data+account_read&response_type=code" +
            "&redirect_uri=";

        resolve(authUrl); 
    });
}
exports.getAccessToken = function(code, redirect_uri, clientId){
    return new Promise(function(resolve, reject){
        var baseUrl = "https://idfed.constantcontact.com/as/token.oauth2";
        var authUrl = 
            baseUrl +
            "?code=" +
            code +
            "&redirect_uri=" +
            redirect_uri +
            "&grant_type=authorization_code";
        var auth = clientId + ":" + process.env.CC_SECRET;
        var authBase64 = Buffer.from(auth).toString('base64');
        var authHeader = "Basic " + authBase64;
        
        var headers = {
            "Authorization": authHeader
        };
        var options = {
           url: authUrl,
           method: 'POST',
           headers: headers
        };
        axios(options).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

exports.refreshToken = function(query, clientId){
    return new Promise(function(resolve, reject){
        var baseUrl = "https://idfed.constantcontact.com/as/token.oauth2";
        var refreshUrl =
            baseUrl + 
            "?" + query +
            "&grant_type=refresh_token";
        var auth = clientId + ":" + process.env.CC_SECRET;
        console.log(auth);
        var authBase64 = Buffer.from(auth).toString('base64');
        var authHeader = "Basic " + authBase64;

        var headers = {
            "Authorization": authHeader
        };
        var options = {
            url: refreshUrl,
            method: 'POST',
            headers: headers
        };
        axios(options).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

