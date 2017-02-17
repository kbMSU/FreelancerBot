var axios = require('axios');
var Response = require('./Response.js');

var typeKeywords = ['job','project','jobs','projects'];
var filterKeywords = ['website','it','mobile','writing','art','design','data','entry','software','dev',
'contest','pickup','delivery','cleaning','development'
];

var recipientId;
var message;
var response;

function Projects(recipientId) {
  console.log("Instantiated Projects");
  this.recipientId = recipientId;
  this.message = "";
  this.response = new Response();
}

Projects.prototype.isSearchingForProjects = function(senderId, message) {
  console.log("Is searching for projects");
  var messageText = message.trim();
  messageText = messageText.toLowerCase();
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
  console.log("Returning isSearchingForProjects");
  return isSearcingForProject;
};

Projects.prototype.getResponseForProjectSearch = function(words) {
  console.log("Getting response for project search");
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
  console.log("Getting All project categories");
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
  console.log("Getting projects for query");
};

Projects.prototype.sendResponse = function(messageData) {
  console.log("Sending response back");
  response.callSendAPI(messageData);
};

module.exports = Projects;
