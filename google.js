const axios = require('axios');
const utilities = require('./utilities');
const {
    OAuth2Client
} = require('google-auth-library');

const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage'
);

exports.getTokens = function(code){
    return new Promise(function(resolve, reject){
        oAuth2Client.getToken(code).then(function(tokens){
            resolve(tokens);
        }).catch(function(err){
            reject(utilities.processAxiosError(err));
        });
    });
}

