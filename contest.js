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
  return axios.get('https://www.freelancer.com/api/contests/0.1/contests/?statuses[]=active&limit=4', {
    transformResponse: [function (data) {
      var dataJson = JSON.parse(data);
      return dataJson.result.contests;
    }],
  });
}

Contest.prototype.getElementList = function(contestList) {
  var elementList = [];

  for (var i = 0; i < contestList.length; i++) {
    var contest = contestList[i];
    var element = {
      title: contest.title,
      subtitle: 'test',
      default_action: {
        type: 'web_url',
        url: 'https://www.freelancer.com/' + contest.seo_url 
        messenger_extensions: true,
        webview_height_ratio: 'tall',
        fallback_url: 'https://www.freelancer.com'
      }
    }
    elementList.push(element);
  }

  return elementList;
}

// export the class
module.exports = Contest;