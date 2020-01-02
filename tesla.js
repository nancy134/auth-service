const rp = require('request-promise');

exports.initiateAuth = function (username, password) {
    return new Promise(function(resolve, reject) {
        var url = process.env.TESLA_URI + "/oauth/token";
        var body = {
            grant_type: "password",
            client_id: process.env.TESLA_CLIENT_ID,
            client_secret: process.env.TESLA_CLIENT_SECRET,
            email: username,
            password: password
        };
        var headers = {
            'User-Agent': 'NP Software Fleet Management/1.0'
        };
        var options = {
            method: 'POST',
            uri: url,
            body: body,
            headers: headers,
            json: true
        };
        console.log("options: "+JSON.stringify(options));
        rp(options).then(function(resp){
            resolve(resp);
        })
        .catch(function(err){
            reject(err);
        });
    });
}

