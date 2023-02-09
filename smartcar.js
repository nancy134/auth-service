const axios = require('axios');
const utilities = require('./utilities');
const smartcar = require('smartcar');

const client = new smartcar.AuthClient({
    clientId: process.env.SMARTCAR_CLIENT_ID,
    clientSecret: process.env.SMARTCAR_CLIENT_SECRET,
    redirectUri: process.env.SMARTCAR_REDIRECT_URI
});

const scope = ['read_odometer', 'read_vehicle_info', 'required:read_location'];
const options = {};

exports.getTokens = function(code){
    return new Promise(function(resolve, reject){
        client.exchangeCode(code).then(function(access){
            resolve(access);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getAuthorizationUrl = function(){
    return new Promise(function(resolve, reject){
        var baseUrl = "https://connect.smartcar.com/oauth/authorize?";
        var authUrl =
        baseUrl +
        "response_type=code" +
        "&client_id=" + client.clientId +
        "&scope=read_odometer " +
		"read_vehicle_info " +
		"read_vin read_battery " +
		"read_odometer " +
		"read_tires " +
		"read_fuel " +
		"read_charge " +
        "control_charge " +
        "control_security " +
		"required:read_location" +
        "&state=0facda3q3q3q3q19" +

        "&redirect_uri=" + client.redirectUri +
        "&mode=test"

        resolve(authUrl);
    });
}


exports.refreshAccessToken = function(body){
    return new Promise(function(resolve, reject){
        var baseUrl = "https://auth.smartcar.com/oauth/token";
        var auth = client.clientId + ":" + client.clientSecret;
        var authBase64 = Buffer.from(auth).toString('base64');
        var authHeader = "Basic " + authBase64;

        var headers = {
            "Authorization": authHeader,
            "Content-Type": "application/x-www-form-urlencoded"
        }
        var data = "grant_type=refresh_token&refresh_token=" + body.refresh_token;
        var options = {
           url: baseUrl,
           method: 'POST',
           headers: headers,
           data: data
        };
        axios(options).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

