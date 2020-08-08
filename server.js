'use strict';

const express = require('express');
const cognito = require('./cognito');
const bodyParser = require('body-parser');
const rabbitmq = require('./rabbitmq');
const tesla = require('./tesla');
const vex = require('./vex');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

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
  res.send('Hello world\n');
});
app.post('/signUp', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var cognitoClientId = req.body.cognitoClientId;
    var signUpPromise = cognito.signUp(username, password,cognitoClientId);
    signUpPromise.then(function(result){
        res.send(result);
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

app.post('/confirmSignUp', function(req,res){
    var username = req.body.username;
    var code = req.body.code;
    var cognitoClientId = req.body.cognitoClientId;
    var confirmSignUpPromise = cognito.confirmSignUp(username, code, cognitoClientId);
    confirmSignUpPromise.then(function(result) {
        res.send(result);
        //rabbitmq.emit(username);
    }).catch(function(err) {
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

app.get('/deleteUser', (req, res) => {
    var deleteUserPromise = cognito.deleteUser(req.query.userPoolId, req.query.email);
    deleteUserPromise.then(function(result){
        res.json(result);
    }).catch(function(err){
        var formattedError = formatError(err);
        res.status(formattedError.statusCode).send(formattedError);
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

app.listen(PORT, HOST);
