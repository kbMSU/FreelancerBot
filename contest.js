var axios = require('axios');

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
  axios.get('https://www.freelancer.com/api/contests/0.1/contests/?statuses[]=active&limit=10')
    .then(function(response) {
      return response.data.result.contests;
    });
}

// export the class
module.exports = Contest;