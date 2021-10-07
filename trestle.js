const axios = require('axios');
const utilities = require('./utilities');
const qs = require('qs')



exports.getAccessToken = function(){

    return new Promise(function(resolve, reject){
        var url = "https://api-prod.corelogic.com/trestle/oidc/connect/token";
        var data = {
            client_id: process.env.TRESTLE_CLIENT_ID,
            client_secret: process.env.TRESTLE_CLIENT_SECRET,
            scope: "api",
            grant_type: "client_credentials"
        }
        var headers = {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
        var options = {
           url: url,
           method: 'POST',
           headers: headers,
           data: qs.stringify(data)
        };
        axios(options).then(function(result){
            resolve(result.data);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}
