const axios = require('axios');
const utilities = require('./utilities');
function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() *  charactersLength)));
   }
   return result.join('');
}

exports.getAuthorizationUrl = function(clientId){
    var state = makeid(6);
    return new Promise(function(resolve, reject){
        var baseUrl = "https://authz.constantcontact.com/oauth2/default/v1/authorize";
        var authUrl = 
            baseUrl + 
            "?client_id=" + 
            clientId +
            "&state=" +
            state +
            "&scope=contact_data+campaign_data+account_read+offline_access&response_type=code" +
            "&redirect_uri=";

        resolve(authUrl); 
    });
}
exports.getAccessToken = function(code, redirect_uri, clientId){
    return new Promise(function(resolve, reject){
        var baseUrl = "https://authz.constantcontact.com/oauth2/default/v1/token";
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
            var error = utilities.processAxiosError(err);
            reject(error);
        });
    });
}

exports.refreshToken = function(query, clientId){
    return new Promise(function(resolve, reject){
        var baseUrl = "https://authz.constantcontact.com/oauth2/default/v1/token";
        var refreshUrl =
            baseUrl + 
            "?" + query +
            "&grant_type=refresh_token";
        var auth = clientId + ":" + process.env.CC_SECRET;
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

