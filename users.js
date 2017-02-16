
var request = require('request');
function sendUserMessage(senderID, messageText) {
	var result = callFLUserLists();
	callSendAPI(result);
}

function callFLUserLists(parameters) {
	var uri = 'https://www.freelancer.com/api/users/0.1/users/directory';
  request({
    uri: uri,
    method: 'GET'

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
}