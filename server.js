'use strict';

const express = require('express');
const cognito = require('./cognito');
const bodyParser = require('body-parser');
const rabbitmq = require('./rabbitmq');

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
    var signUpPromise = cognito.signUp(username, password);
    signUpPromise.then(function(result){
        res.send(result);
    }).catch(function(err){
        res.status(err.statusCode).send(err);
    });
});
app.post('/initiateAuth', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
    var initiateAuthPromise = cognito.initiateAuth(username, password);
    initiateAuthPromise.then(function(result) {
        res.send(result.AuthenticationResult);
    }).catch(function(err) {
        res.status(err.statusCode).send(err);
    })
});

app.post('/confirmSignUp', function(req,res){
    var username = req.body.username;
    var code = req.body.code;
    var confirmSignUpPromise = cognito.confirmSignUp(username, code);
    confirmSignUpPromise.then(function(result) {
        res.send(result);
        rabbitmq.emit(username);
    }).catch(function(err) {
        res.status(err.statusCode).send(err);
    });
});

app.listen(PORT, HOST);
