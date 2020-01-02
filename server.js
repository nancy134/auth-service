'use strict';

const express = require('express');
const cognito = require('./cognito');
const bodyParser = require('body-parser');
const rabbitmq = require('./rabbitmq');
const tesla = require('./tesla');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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
        res.status(err.statusCode).send(err);
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
        res.status(err.statusCode).send(err);
    })
});

app.post('/confirmSignUp', function(req,res){
    var username = req.body.username;
    var code = req.body.code;
    var cognitoClientId = req.body.cognitoClientId;
    var confirmSignUpPromise = cognito.confirmSignUp(username, code, cognitoClientId);
    confirmSignUpPromise.then(function(result) {
        res.send(result);
        rabbitmq.emit(username);
    }).catch(function(err) {
        res.status(err.statusCode).send(err);
    });
});

app.get('/listUserPools', function(req, res){
    var listUserPoolsPromise = cognito.listUserPools();
    listUserPoolsPromise.then(function(result){
        res.send(result);
    }).catch(function(err) {
        res.status(err.statusCode).send(err);
    });
});

app.get('/describeUserPool', function(req, res){
    var describeUserPoolPromise = cognito.describeUserPool(req.query.userPoolId);
    describeUserPoolPromise.then(function(result){
        res.send(result);
    }).catch(function(err) {
        res.status(err.statusCode).send(err);
    });
});

app.get('/listUserPoolClients', function(req, res){
    var listUserPoolClientsPromise = cognito.listUserPoolClients(req.query.userPoolId);
    listUserPoolClientsPromise.then(function(result){
        res.send(result);
    }).catch(function(err) {
        res.status(err.statusCode).send(err);
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
app.listen(PORT, HOST);
