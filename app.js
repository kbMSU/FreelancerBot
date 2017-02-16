var express = require('express');
var fs = require('fs');
var https = require('https');
var app = express();

app.get('/', function (req, res) {
  console.log("Received request");
  res.send('Hello World!');
});

app.get('/webhook', function(req, res) {
  console.log("Received webhook");
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'freelancer_bot_hackathon') {
    console.log("Validated webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
}, app).listen(8000, function () {
  console.log('Example app listening on port 8000!');
});

module.exports = app;
