var request = require('request');

// Constructor
function Contest() {
  // always initialize all instance properties
  this.textMessage = '';
}
// class methods
Contest.prototype.sayContest = function(textMessage) {
  var re = new RegExp('^contest$');

  this.textMessage = textMessage;
  if (re.test(textMessage)) {
    return true;
  } else {
    return false;
  }
};

Contest.prototype.showContests = function() {
  request('https://www.freelancer.com/api/contests/0.1/contests/?statuses[]=active&limit=10', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      return body;
    }
  })
}

// export the class
module.exports = Contest;