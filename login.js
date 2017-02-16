var ClientOAuth2 = require('client-oauth2')

var freelancerAuth = new ClientOAuth2({
  clientId: 'bbdee7b0-c1b3-4d52-9046-fc80685fe1d3',
  clientSecret: 'ca1bdda8213d081bf6c9384fec392f37a9d06c721d1b3d207ce1198b3a977a37f39e294cefab8b976c0aa92d1c86c9e2733f318bd4801558973bdc312c0e824c',
  accessTokenUri: 'http://accounts.syd1.fln-dev.net/oauth/token',
  authorizationUri: 'http://accounts.syd1.fln-dev.net/oauth/authorise',
  redirectUri: 'https://freelancerbot.flndev.com/auth',
  scopes: ['advanced']
})

var express = require('express');
var app = express();

app.get('/auth', function (req, res) {
	res.send('auth');
});
 
app.get('/auth/freelancer', function (req, res) {
  var uri = freelancerAuth.code.getUri();
 
  res.redirect(uri);
});
 
app.get('/auth/freelancer/callback', function (req, res) {
  freelancerAuth.code.getToken(req.originalUrl)
    .then(function (user) {
      console.log(user); //=> { accessToken: '...', tokenType: 'bearer', ... } 
 
      // Refresh the current users access token. 
      user.refresh().then(function (updatedUser) {
        console.log(updatedUser !== user); //=> true 
        console.log(updatedUser.accessToken);
      });
 
      // Sign API requests on behalf of the current user. 
      user.sign({
        method: 'get',
        url: 'http://www.freelancer.com'
      });
 
      // We should store the token into a database. 
      return res.send(user.accessToken)
    });
});

app.listen(5000, function () {
  console.log('Example app listening on port 3000!')
})