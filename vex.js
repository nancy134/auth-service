const rp = require('request-promise');

var signin = function(body){
    return new Promise(function(resolve, reject){
        var options = {
            uri: process.env.VEX_URI+"/api/sessions",
            method: 'POST',
            json: true,
            body: body
        };
        rp(options).then(function(resp){
            resolve(resp);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.signin = signin;
