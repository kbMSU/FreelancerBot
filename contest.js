var axios = require('axios');

// Constructor
function Contest() {
  // always initialize all instance properties
  this.textMessage = '';
}
// class methods
Contest.prototype.isPayload = function(payload) {
  var re = new RegExp('^contest');

  if (re.test(payload)) {
    return true;
  } else {
    return false;
  }
}

Contest.prototype.getListNum = function(payload) {
  return parseInt(payload.split('|')[1]) + 1;
}

Contest.prototype.sayContest = function(textMessage) {
  var re = new RegExp('^contest$');

  this.textMessage = textMessage;
  if (re.test(textMessage)) {
    return true;
  } else {
    return false;
  }
};

Contest.prototype.getContests = function(listNum) {
  var limit = 4;
  var offset = listNum * 4
  return axios.get('https://www.freelancer.com/api/contests/0.1/contests/?statuses[]=active&limit=' + limit + '&offset=' + offset, {
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
    var seo_url = 'https://www.freelancer.com/' + contest.seo_url;

    var element = {
      title: contest.title,
      subtitle: contest.description,
      item_url: seo_url
    }
    elementList.push(element);
  }

  return elementList;
}

// export the class
module.exports = Contest;