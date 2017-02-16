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

Contest.prototype.getContests = function() {
  return axios.get('https://www.freelancer.com/api/contests/0.1/contests/?statuses[]=active&limit=10', {
    transformResponse: [function (data) {
      var dataJson = JSON.parse(data);
      return dataJson.result.contests;
    }],
  });
}

// export the class
module.exports = Contest;