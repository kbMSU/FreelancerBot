var express = require('express');
var fs = require('fs');
var https = require('https');

var bodyParser = require('body-parser');
var config = require('config');
var crypto = require('crypto');
var request = require('request');

var Contest = require('./contest.js');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static('public'));

var PAGE_ACCESS_TOKEN = 'EAAGHIKQ5uIkBALhexC4HbiTdozsnXcQbI5JrsiOJ0qaDJyYoZBMiNBpjGZBeMiZBBSB3VZCbTIZCIZAfFw6GRZCSKmIy100jU9hTZBWkStWJSaZA2FT2ZBsxxAtuo9EuKJdZBKyFRQmdf6yTtG2AuUpU78quA5DKLHnldmysafE8pxKkwZDZD';
var VERIFY_TOKEN = 'freelancer_bot_hackathon';

app.get('/', function (req, res) {
  console.log("Received basic hello world request");
  res.send('Hello World!');
});

app.get('/webhook', function(req, res) {
  console.log("Received request to subscribe");
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === VERIFY_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

app.post('/webhook', function (req, res) {
  var data = req.body;
  console.log("Received message");
  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
   senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  var contest = new Contest();

  if (messageText) {
    console.log(messageText);
   // If we receive a text message, check to see if it matches a keyword
   // and send back the example. Otherwise, just echo the text we received.
    if (contest.sayContest(messageText)) {
      console.log('contest');
      contest.showContests()
        .then(function (response) {
          sendTextMessage(senderID, response.toString());
        })
    } else {
      console.log('normal_message');
      sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendGenericMessage(recipientId, messageText) {
  // To be expanded in later sections
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
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
}

https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/freelancerbot.flndev.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/freelancerbot.flndev.com/fullchain.pem')
}, app).listen(80, function () {
  console.log('Example app listening on port 80!');
});

module.exports = app;
