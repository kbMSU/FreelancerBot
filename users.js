var axios = require('axios');

// Constructor
function Users() {
  // always initialize all instance properties
  this.parameters = '';
}
// class methods
Users.prototype.getUserList = function(parameters) {
  var response = getUsers();
  responseJson = JSON.parse(response);
  return responseJson.result.users;
};

function getUsers() {	
  return axios.get('https://www.freelancer.com/api/users/0.1/users/directory);
}

// export the class
module.exports = Users;