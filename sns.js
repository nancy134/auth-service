const AWS = require('aws-sdk');

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

exports.publishMessage = function(topicARN, message){
    // Create publish parameters
    var params = {
        Message: message,
        TopicArn: topicARN 
    };

    // Create promise and SNS service object
    var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

    // Handle promise's fulfilled/rejected states
    publishTextPromise.then(function(data) {
        console.log(`Message ${params.Message} send sent to the topic ${params.TopicArn}`);
        console.log("MessageID is " + data.MessageId);
    }).catch(function(err) {
        console.error(err, err.stack);
    });
}


