var AWS = require('aws-sdk-mock');
var cognito = require("../cognito");
describe("signUp", () => {

    beforeEach(() => {
        AWS.mock('CognitoIdentityServiceProvider', "signUp", function(params, callback){
            callback(null, 'success');
        });
    });

    afterEach(() => {
        AWS.restore("CognitoIdentityServiceProvider", "signUp");
    });

    it("signup", () => {
       cognito.signUp().then(function(result){
           done();
       });

    });
});
describe("initiateAuth", () => {
    beforeEach(() => {
        AWS.mock('CognitoIdentityServiceProvider', "initiateAuth", function(params, callback){
            callback(null, 'success');
        });
    });

    afterEach(() => {
        AWS.restore("CognitoIdentityServiceProvider", "initiateAuth");
    });

    it("initiateAuth", () => {
       cognito.initiateAuth().then(function(result){
           done();
       });

    });
    it("refreshToken", () => {
        cognito.refreshToken().then(function(result){
            done();
        });
    });

});
describe("confirmSignUp", () => {
    beforeEach(() => {
        AWS.mock('CognitoIdentityServiceProvider', "confirmSignUp", function(params, callback){
            callback(null, 'success');
        });
    });

    afterEach(() => {
        AWS.restore("CognitoIdentityServiceProvider", "confirmSignUp");
    });

    it("confirmSignUp", () => {
       cognito.confirmSignUp().then(function(result){
           done();
       });

    });

});

describe("forgotPassword", () => {
    beforeEach(() => {
        AWS.mock('CognitoIdentityServiceProvider', "forgotPassword", function(params, callback){
            callback(null, 'success');
        });
    });

    afterEach(() => {
        AWS.restore("CognitoIdentityServiceProvider", "forgotPassword");
    });

    it("forgotPassword", () => {
       cognito.forgotPassword().then(function(result){
           done();
       });

    });

});

describe("confirmForgotPassword", () => {
    beforeEach(() => {
        AWS.mock('CognitoIdentityServiceProvider', "confirmForgotPassword", function(params, callback){
            callback(null, 'success');
        });
    });

    afterEach(() => {
        AWS.restore("CognitoIdentityServiceProvider", "confirmForgotPassword");
    });

    it("confirmForgotPassword", () => {
       cognito.confirmForgotPassword().then(function(result){
           done();
       });

    });

});

describe("listUserPools", () => {
    beforeEach(() => {
        AWS.mock('CognitoIdentityServiceProvider', "listUserPools", function(params, callback){
            callback(null, 'success');
        });
    });

    afterEach(() => {
        AWS.restore("CognitoIdentityServiceProvider", "listUserPools");
    });

    it("listUserPools", () => {
       cognito.listUserPools().then(function(result){
           done();
       });

    });

});

describe("describeUserPool", () => {
    beforeEach(() => {
        AWS.mock('CognitoIdentityServiceProvider', "describeUserPool", function(params, callback){
            callback(null, 'success');
        });
    });

    afterEach(() => {
        AWS.restore("CognitoIdentityServiceProvider", "describeUserPool");
    });

    it("describeUserPool", () => {
       cognito.describeUserPool().then(function(result){
           done();
       });

    });

});

describe("listUserPoolClients", () => {
    beforeEach(() => {
        AWS.mock('CognitoIdentityServiceProvider', "listUserPoolClients", function(params, callback){
            callback(null, 'success');
        });
    });

    afterEach(() => {
        AWS.restore("CognitoIdentityServiceProvider", "listUserPoolClients");
    });

    it("listUserPoolClients", () => {
       cognito.listUserPoolClients().then(function(result){
           done();
       });

    });

});

describe("adminDeleteUser", () => {
    beforeEach(() => {
        AWS.mock('CognitoIdentityServiceProvider', "adminDeleteUser", function(params, callback){
            callback(null, 'success');
        });
    });

    afterEach(() => {
        AWS.restore("CognitoIdentityServiceProvider", "adminDeleteUser");
    });

    it("adminDeleteUser", () => {
       cognito.adminDeleteUser().then(function(result){
           done();
       });

    });

});

describe("listUsers", () => {
    beforeEach(() => {
        AWS.mock('CognitoIdentityServiceProvider', "listUsers", function(params, callback){
            callback(null, 'success');
        });
    });

    afterEach(() => {
        AWS.restore("CognitoIdentityServiceProvider", "listUsers");
    });

    it("listUsers", () => {
       cognito.listUsers().then(function(result){
           done();
       });

    });

});

describe("deleteUser success", () => {
    beforeEach(() => {
        AWS.mock('CognitoIdentityServiceProvider', "listUsers", function(params, callback){
            callback(null, {Users: [{ 
                UserPoolId: "userPoolId",
                Username: "username"
            }]});
        });
        AWS.mock('CognitoIdentityServiceProvider', "adminDeleteUser", function(params, callback){
            callback(null, 'success');
        });

    });

    afterEach(() => {
        AWS.restore("CognitoIdentityServiceProvider", "listUsers");
        AWS.restore("CognitoIdentityServiceProvider", "adminDeleteUser");
    });

    it("deletUser", (done) => {
       cognito.deleteUser("userPoolId","email").then(function(result){
           done();
       }).catch(function(err){
       });

    });

});

describe("deleteUser error1", () => {
    beforeEach(() => {
        AWS.mock('CognitoIdentityServiceProvider', "listUsers", function(params, callback){
            callback("error", null);
        });
        AWS.mock('CognitoIdentityServiceProvider', "adminDeleteUser", function(params, callback){
            callback(null, 'success');
        });

    });

    afterEach(() => {
        AWS.restore("CognitoIdentityServiceProvider", "listUsers");
        AWS.restore("CognitoIdentityServiceProvider", "adminDeleteUser");
    });

    it("deletUser", (done) => {
       cognito.deleteUser("userPoolId","email").then(function(result){
           done();
       }).catch(function(err){
           done();
       });

    });

});

describe("deleteUser error2", () => {
    beforeEach(() => {
        AWS.mock('CognitoIdentityServiceProvider', "listUsers", function(params, callback){
            callback(null, {Users: [{
                UserPoolId: "userPoolId",
                Username: "username"
            }]});
        });
        AWS.mock('CognitoIdentityServiceProvider', "adminDeleteUser", function(params, callback){
            callback("error", null);
        });

    });

    afterEach(() => {
        AWS.restore("CognitoIdentityServiceProvider", "listUsers");
        AWS.restore("CognitoIdentityServiceProvider", "adminDeleteUser");
    });

    it("deletUser", (done) => {
       cognito.deleteUser("userPoolId","email").then(function(result){
           done();
       }).catch(function(err){
           done();
       });

    });

});

describe("deleteUser error3", () => {
    beforeEach(() => {
        AWS.mock('CognitoIdentityServiceProvider', "listUsers", function(params, callback){
            callback(null, {Users: []});
        });
        AWS.mock('CognitoIdentityServiceProvider', "adminDeleteUser", function(params, callback){
            callback("error", null);
        });

    });

    afterEach(() => {
        AWS.restore("CognitoIdentityServiceProvider", "listUsers");
        AWS.restore("CognitoIdentityServiceProvider", "adminDeleteUser");
    });

    it("deletUser", (done) => {
       cognito.deleteUser("userPoolId","email").then(function(result){
           done();
       }).catch(function(err){
           done();
       });

    });

});

