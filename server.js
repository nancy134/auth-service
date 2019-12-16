'use strict';

const express = require('express');
const cognito = require('./cognito');
const bodyParser = require('body-parser');

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

app.post('/initiateAuth', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
    var initiateAuthResults;
    var initiateAuthPromise = cognito.initiateAuth(username, password);
    initiateAuthPromise.then(function(result) {
        initiateAuthResults = result;
        // Use user details from here
        console.log("result.AuthenticationResult.ExpiresIn: "+result.AuthenticationResult.ExpiresIn);
        res.send({status: "ok"});
    }, function(err) {
        console.log(err);
    })
});

app.listen(PORT, HOST);
