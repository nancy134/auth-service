var amqp = require('amqplib/callback_api');

exports.emit = function(email){
    url = "amqp://" +
          process.env.RABBITMQ_USERNAME +
          ":" +
          process.env.RABBITMQ_PASSWORD +
          "@" +
          process.env.RABBITMQ_HOST +
          ":" +
          process.env.RABBITMQ_PORT

    amqp.connect(url, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            var exchange = 'cognito_users';
            var key = "cognito_user.created";
            var msg = {email: email};
                
            channel.assertExchange(exchange, 'topic', {
                durable: false
            });
            channel.publish(exchange, key, Buffer.from(JSON.stringify(msg)));
            console.log(" [x] Sent %s:'%s'", key, msg);
        });

        setTimeout(function() { 
            connection.close(); 
        }, 500);
    });
}

