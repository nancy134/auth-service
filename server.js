'use strict';

const express = require('express');
const cognito = require('./cognito');
const bodyParser = require('body-parser');
const tesla = require('./tesla');
const vex = require('./vex');
const sns = require('./sns');
const cc = require('./constant');
const url = require('url');
const trestle = require('./trestle');
const spark = require('./spark');
const cookieParser = require('cookie-parser');
const google = require('./google');
const smartcar = require('./smartcar');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

Object.prototype.getName = function() { 
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((this).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
};

function formatError(err){
    var ret = {};

    // If cognito error
    if (err.getName() === "Error"){
        if (err.message) ret.message = err.message;
        else ret.message = "Unknown error";

        if (err.statusCode) ret.statusCode = err.statusCode;
        else ret.statusCode = 400;

        if (err.code) ret.code = err.code;
        else ret.code = null;

        ret.originalMessage = err;
    } else {
        ret.message = "Unknown error";
        ret.statusCode = 400;
        ret.originalMessage = err;
    }

    ret.service = "AuthService";
    return(ret);
}

app.get('/', (req, res) => {
  res.send('auth-service');
});
app.post('/signUp', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var cognitoClientId = req.body.cognitoClientId;
    var signUpPromise = cognito.signUp(username, password,cognitoClientId);
    signUpPromise.then(function(result){
        var userData = {};
        if (req.body.username) userData.email = req.body.username;
        if (result.UserSub) userData.userSub = result.UserSub;
        if (req.body.role) userData.role = req.body.role;
        if (req.body.promoCode) userData.promoCode = req.body.promoCode;
        if (req.body.accessToken) userData.accessToken = req.body.accessToken;
        if (req.body.refreshToken) userData.refreshToken = req.body.refreshToken;
        if (req.body.expiration) userData.expiration = req.body.expiration;
        if (req.body.refreshExpiration) userData.refreshExpiration = req.body.refreshExpiration;
        if (req.body.smartcarId) userData.smartcarId = req.body.smartcarId;        

        console.log(userData);
        sns.newUserEvent(userData).then(function(snsResult){
            res.send(result);
        }).catch(function(err){
            var formattedError = formatError(err);
            res.status(formattedError.statusCode).send(formattedError);
        });
    }).catch(function(err){
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
    });
});
app.post('/initiateAuth', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var cognitoClientId = req.body.cognitoClientId;
    var initiateAuthPromise = cognito.initiateAuth(username, password, cognitoClientId);
    initiateAuthPromise.then(function(result) {
        res.send(result.AuthenticationResult);
    }).catch(function(err) {
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
    })
});

app.post('/refreshToken', function(req, res){
    var refreshToken = req.body.refreshToken;
    var cognitoClientId = req.body.cognitoClientId;
    cognito.refreshToken(refreshToken, cognitoClientId).then(function(result){
        res.send(result.AuthenticationResult);
    }).catch(function(err){
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
    });
});

app.post('/confirmSignUp', function(req,res){
    var username = req.body.username;
    var code = req.body.code;
    var cognitoClientId = req.body.cognitoClientId;
    var confirmSignUpPromise = cognito.confirmSignUp(username, code, cognitoClientId);
    confirmSignUpPromise.then(function(result) {
        res.send(result);
    }).catch(function(err) {
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
    });
});

app.post('/resendConfirmationCode', function(req,res){
    var username = req.body.username;
    var cognitoClientId = req.body.cognitoClientId;
    cognito.resendConfirmationCode(username,cognitoClientId).then(function(result) {
        res.send(result);
    }).catch(function(err) {
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
    });
});

app.post('/forgotPassword', function(req, res){
    var username = req.body.username;
    var cognitoClientId = req.body.cognitoClientId;
    var forgotPasswordPromise = cognito.forgotPassword(username, cognitoClientId);
    forgotPasswordPromise.then(function(result){
        res.send(result);
    }).catch(function(err){
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
    });
});

app.post('/confirmForgotPassword', function(req, res){
    var code = req.body.code;
    var password = req.body.password;
    var username = req.body.username;
    var cognitoClientId = req.body.cognitoClientId;
    var forgotPasswordConfirmPromise = cognito.confirmForgotPassword(code, password, username, cognitoClientId);
    forgotPasswordConfirmPromise.then(function(result){
        res.send(result);
    }).catch(function(err){
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
    });
});

app.get('/listUserPools', function(req, res){
    var listUserPoolsPromise = cognito.listUserPools();
    listUserPoolsPromise.then(function(result){
        res.send(result);
    }).catch(function(err) {
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
    });
});

app.get('/describeUserPool', function(req, res){
    var describeUserPoolPromise = cognito.describeUserPool(req.query.userPoolId);
    describeUserPoolPromise.then(function(result){
        res.send(result);
    }).catch(function(err) {
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
    });
});

app.get('/listUserPoolClients', function(req, res){
    var listUserPoolClientsPromise = cognito.listUserPoolClients(req.query.userPoolId);
    listUserPoolClientsPromise.then(function(result){
        res.send(result);
    }).catch(function(err) {
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
    });
});

app.post('/adminDeleteUser', (req, res) => {
    var adminDeleteUserPromise = cognito.adminDeleteUser(req.body);
    adminDeleteUserPromise.then(function(result){
        res.json(result);
    }).catch(function(err){
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
    });
});

app.get('/listUsers', (req, res) => {
    var params = {
        UserPoolId: req.query.userPoolId,
        AttributesToGet: ['email'],
        Filter: "email = \""+req.query.email+"\""
    };
    var listUsersPromise = cognito.listUsers(params);
    listUsersPromise.then(function(result){
        res.json(result);
    }).catch(function(err){
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
    });
});

app.get('/playUsers', (req, res) => {
    var params = {
        UserPoolId: req.query.userPoolId
    };
    cognito.listUsers(params).then(function(result){
        res.send('ok');
        var promiseArray = [];
        for (var i=0; i<result.Users.length; i++){
            var userData = {
                email: result.Users[i].Attributes[2].Value,
                userSub: result.Users[i].Attributes[0].Value 
            };
            var newUserPromise = sns.newUserEvent(userData);
            promiseArray.push(newUserPromise);
        }
        Promise.all(promiseArray).then((values) => {
        }).catch(function(err){
        });
    }).catch(function(err){
        res.send(err)
    });
});

app.get('/deleteTestUsers', (req, res) => {
    var poolId = "us-east-1_kTtaNstIX";
    var params = {
        UserPoolId: poolId 
    };
    cognito.listUsers(params).then(function(result){
        res.send('ok');
        var promiseArray = [];
        for (var i=0; i<result.Users.length; i++){
            var email = result.Users[i].Attributes[2].Value;
            var deletePromise = cognito.deleteUser(poolId, email);
            promiseArray.push(deletePromise);
        }
        Promise.all(promiseArray).then(function(values){
            console.log(values);
        }).catch(function(err){
            console.log(err);
        });
    }).catch(function(err){
        console.log(err);
    });
});

app.get('/saDeleteTestUsers', (req, res) => {
    var poolId = "us-east-1_hTXJ9v5Pr";
    var params = {
        UserPoolId: poolId
    };
    cognito.listUsers(params).then(function(result){
        res.send('ok');
        var promiseArray = [];
        for (var i=0; i<result.Users.length; i++){
            var email = result.Users[i].Attributes[2].Value;
            var deletePromise = cognito.deleteUser(poolId, email);
            promiseArray.push(deletePromise);
            console.log(email);
        }
        Promise.all(promiseArray).then(function(values){
            console.log(values);
        }).catch(function(err){
            console.log(err);
        });
    }).catch(function(err){
        console.log(err);
    });
});

app.get('/deleteUser', (req, res) => {
    var deleteUserPromise = cognito.deleteUser(req.query.userPoolId, req.query.email);
    deleteUserPromise.then(function(result){
        res.json(result);
    }).catch(function(err){
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
    });
});

app.get('/listTopics', (req, res) => {
    sns.listTopics();
    res.json("ok");
});

app.post('/publishMessage', (req, res) => {
    sns.publishMessage(req.body.arn, req.body.message).then(function(result){
        res.json(result);
    }).catch(function(err){
        res.json(err);
    });
});



app.post('/teslaAuth', function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    var teslaAuthPromise = tesla.initiateAuth(email,password);
    teslaAuthPromise.then(function(result){
       res.send(result);
    }).catch(function(err){
        res.send(err);
    });
});

app.post('/vexAuth', function(req, res){
    var body = {
        user: {
            email: req.body.email,
            password: req.body.password
        }
    };
    var signinPromise = vex.signin(body);
    signinPromise.then(function(result){
        res.json(result); 
    }).catch(function(err){
        res.status(400).json(err);
    });
});
/////////////////////////////////////////
// Constant Contact
/////////////////////////////////////////
app.get('/cc/auth', function(req, res){
    var clientId = req.query.clientId;
    cc.getAuthorizationUrl(clientId).then(function(result){
        res.send(result);
    }).catch(function(err){
        res.send(err);
    });
});

app.get('/cc/authToken', function(req, res){
    var code = req.query.code;
    var redirect_uri = req.query.redirect_uri;
    var clientId = req.query.clientId;
    cc.getAccessToken(code, redirect_uri, clientId).then(function(result){
        res.send(result.data);
    }).catch(function(err){
        if (err.statusCode){
            res.status(err.statusCode).send(err);
        }else{
            res.status(400).send(err);
        }
    }); 
});

app.get('/cc/refreshToken', function(req, res){
    var query = url.parse(req.url).query;
    var clientId = req.query.clientId
    var refresh_token = req.query.refresh_token;
    var query = "refresh_token=" + refresh_token;
    cc.refreshToken(query, clientId).then(function(result){
        res.send(result.data);
    }).catch(function(err){
        if (err.statusCode){
            res.status(err.statusCode).send(err);
        }else{
            res.status(400).send(err);
        }
    });
});
/////////////////////////////////////
// Spark
/////////////////////////////////////

app.get('/spark/authUrl', function(req, res){
    var clientId = req.query.clientId;
    spark.getAuthorizationUrl(clientId).then(function(result){
        res.send(result);
    }).catch(function(err){
        res.send(err);
    });
});

app.post('/spark/authToken', function(req, res){
    spark.getAccessToken(req.body).then(function(result){
        res.send(result.data);
    }).catch(function(err){
        res.send(err);
    });
});

app.delete('/spark/authToken/:id', function(req, res){
    spark.deleteAccessToken(req.params.id).then(function(result){
        res.send(result.data);
    }).catch(function(err){
        res.send(err);
    });
});

/////////////////////////////////////
// Trestle
////////////////////////////////////

app.get('/trestle/auth', function(req, res){
    trestle.getAccessToken().then(function(result){
        res.send(result);      
    }).catch(function(err){
        console.log(err);
        res.send(err);
    });
});

app.post('/spark/refreshToken', function(req, res){
    spark.refreshAccessToken(req.body).then(function(result){
        res.send(result.data);
    }).catch(function(err){
        console.log(err);
        var statusCode = 500;
        if (err.statusCode) statusCode = err.statusCode;
        res.status(statusCode).send(err);
    });
});

app.get('/spark/logoutUrl', function(req, res){
    var clientId = req.query.clientId;
    spark.getLogoutUrl(clientId).then(function(result){
        res.send(result);
    }).catch(function(err){
        res.send(err);
    });
});

///////////////////////////////////////////////
// Google
///////////////////////////////////////////////

app.post('/google/auth', function(req, res){
    google.getTokens(req.body.code).then(function(tokens){
        res.send(tokens);
    }).catch(function(err){
        var statusCode = 500;
        if (err.statusCode) statusCode = err.statusCode;
        res.status(statusCode).send(err);
    });
});

////////////////////////////////////////////////
// SmartCar
////////////////////////////////////////////////

app.post('/smartcar/auth', function(req, res){
    smartcar.getTokens(req.body.code).then(function(tokens){
        res.send(tokens);
    }).catch(function(err){
        console.log(err);
        var statusCode = 500;
        if (err.statusCode) statusCode = err.statusCode;
        res.status(statusCode).send(err);
    });
});

app.get('/smartcar/authUrl', function(req, res){
    smartcar.getAuthorizationUrl().then(function(result){
        res.send(result);
    }).catch(function(err){
        res.send(err);
    });
});

app.post('/smartcar/refreshToken', function(req, res){
    smartcar.refreshAccessToken(req.body).then(function(result){
        res.send(result.data);
    }).catch(function(err){
        console.log(err);
        var statusCode = 500;
        if (err.statusCode) statusCode = err.statusCode;
        res.status(statusCode).send(err);
    });
});

app.get('/cookieTest', function (req, res) {
    // Cookies that have not been signed
    console.log('Cookies: ', req.cookies)
  
    // Cookies that have been signed
    console.log('Signed Cookies: ', req.signedCookies)
    res.cookie('test', 'cookievalue', {
      maxAge: 86400 * 1000, // 24 hours
      httpOnly: true, // http only, prevents JavaScript cookie access
      secure: true // cookie must be sent over https / ssl
    });
    res.send("cookie test");
    
  });
  
app.listen(PORT, HOST);
