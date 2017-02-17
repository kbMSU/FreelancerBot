var axios = require('axios');
var requre = require('./Response.js');

var typeKeywords = ['job','project','jobs','projects'];
var filterKeywords = ['website','it','mobile','writing','art','design','data','entry','software','dev',
'contest','pickup','delivery','cleaning','development'
];

var recipientId;
var message;
var response;

function Projects(recipientId) {
  this.recipientId = recipientId;
  this.message = "";
  this.response = Response();
}

Projects.prototype.isSearchingForProjects = function(senderId, messageText) {
  this.message = messageText;

  var words = messageText.split(" ");
  var isSearcingForProject = false;
  for(i=0;i<words.length;i++){
    word = words[i];
    if(typeKeywords.contains(word)) {
      isSearcingForProject = true;
      break;
    }
  }

  if(isSearcingForProject) {
    getResponseForProjectSearch(words);
  }
  return isSearcingForProject;
};

Projects.prototype.getResponseForProjectSearch = function(words) {
  var filters = [];
  for(i=0;i<words.length;i++) {
    word = words[i];
    if(filterKeywords.contains(word)) {
      filters.push(word);
    }
  }

  if(filters.length > 0) {
    getProjectsForQuery(filters);
  } else {
    getAllProjectCategories();
  }
};

Projects.prototype.getAllProjectCategories = function() {
  axios.get("https://www.freelancer.com/api/projects/0.1/job_bundle_categories/", function(data) {
    var json = JSON.parse(data);
    var success = json.success;
    if(success){
      var categories = json.result.job_bundle_categories;
      var items = [];
      for(i=0;i<categories.length;i++) {
        var category = categories[i];
        items.push({title:category.name});
      }
      var response = {
        recipient: {
          id: this.recipientId
        },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: items
            }
          }
        }
      };
      sendResponse(response);
    } else {
      var error = {
        recipient: {
          id: this.recipientId
        },
        message: {
          text: "There was an error getting project categories"
        }
      };
      sendResponse(error);
    }
  });
};

Projects.prototype.getProjectsForQuery = function(filters) {

};

Projects.prototype.sendResponse = function(messageData) {
  response.callSendAPI(messageData);
};

module.exports = Projects;
