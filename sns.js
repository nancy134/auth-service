const AWS = require('aws-sdk');
const newUserTopicARN = process.env.AWS_SNS_NEW_USER_TOPIC;

exports.listTopics = function(){

    // Create promise and SNS service object
    var listTopicsPromise = new AWS.SNS({apiVersion: '2010-03-31'}).listTopics({}).promise();

    // Handle promise's fulfilled/rejected states
    listTopicsPromise.then(function(data) {
        console.log(data.Topics);
    }).catch(function(err) {
        console.error(err, err.stack);
    });
}

exports.newUserEvent = function(userData){
    return new Promise(function(resolve, reject){
        var params = {
            Message: JSON.stringify(userData),
            TopicArn: newUserTopicARN
        };
        console.log(params);
        var publishPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
        publishPromise.then(function(data){
            resolve(data);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.publishMessage = function(topicARN, message){
    // Create publish parameters
    var params = {
        Message: message,
        TopicArn: topicARN 
    };

    // Create promise and SNS service object
    var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

    return new Promise(function(resolve, reject){
        publishTextPromise.then(function(data) {
            resolve(data);
        }).catch(function(err) {
            reject(err);
        });
    });
}


