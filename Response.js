var axios = require('axios');
var request = require('request');

var PAGE_ACCESS_TOKEN = 'EAAGHIKQ5uIkBALhexC4HbiTdozsnXcQbI5JrsiOJ0qaDJyYoZBMiNBpjGZBeMiZBBSB3VZCbTIZCIZAfFw6GRZCSKmIy100jU9hTZBWkStWJSaZA2FT2ZBsxxAtuo9EuKJdZBKyFRQmdf6yTtG2AuUpU78quA5DKLHnldmysafE8pxKkwZDZD';

function Response() {

}

Response.prototype.callSendAPI = function(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
};

module.exports = Response;
