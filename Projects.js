var axios = require('axios');
var Response = require('./Response.js');

var typeKeywords = ['job','project','jobs','projects'];
var filterKeywords = ['website','it','mobile','writing','art','design','data','entry','software','dev',
'contest','pickup','delivery','cleaning','development'
];

var recipientId;
var message;
var response;
var that;

var offset = 0;

function Projects(recipientId) {
  console.log("Instantiated Projects");
  this.recipientId = recipientId;
  this.message = "";
  this.response = new Response();
  this.that = this;
}

Projects.prototype.isSearchingForProjects = function(senderId, messageText) {
  console.log("Is searching for projects");
  this.message = messageText;
  console.log("Message is : " + this.message);
  this.message = this.message.trim();
  this.message = this.message.toLowerCase();

  var words = this.message.split(" ");
  var isSearcingForProject = false;
  for(i=0;i<words.length;i++){
    word = words[i];
    if(typeKeywords.includes(word)) {
      isSearcingForProject = true;
      break;
    }
  }

  if(isSearcingForProject) {
    this.getResponseForProjectSearch(words);
  }
  console.log("Returning isSearchingForProjects");
  return isSearcingForProject;
};

Projects.prototype.getResponseForProjectSearch = function(words) {
  console.log("Getting response for project search");
  var filters = [];
  for(i=0;i<words.length;i++) {
    word = words[i];
    if(filterKeywords.includes(word)) {
      filters.push(word);
    }
  }

  if(filters.length > 0) {
    this.getProjectsForQuery(filters);
  } else {
    this.getAllProjectCategories();
  }
};

Projects.prototype.getAllProjectCategories = function() {
  console.log("Getting All project categories");

  this.getCategoriesPromise().then((response) => this.processCategoriesResponse(response));
};

Projects.prototype.getCategoriesPromise = function() {
  return axios.get("https://www.freelancer.com/api/projects/0.1/job_bundle_categories/");
};

Projects.prototype.processCategoriesResponse = function(resp) {
  var json = resp.data;//JSON.parse(resp);
  //console.log(json);
  var status = json.status;
  if(status==='success'){
    console.log("It is a success");
    var categories = json.result.job_bundle_categories;
    //console.log(categories);
    var items = [];
    for(i=0;i<categories.length;i++) {
      var category = categories[i];
      items.push({title:category.name,
      buttons: [
        {
          type: "postback",
          title: "View Projects",
          payload: "CATEGORY."+category.name,
        }
      ]});
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
    console.log("Sending successfull response");
    //console.log(items);
    this.sendResponse(response);
  } else {
    console.log("It is an error");
    var error = {
      recipient: {
        id: this.recipientId
      },
      message: {
        text: "There was an error getting project categories"
      }
    };
    this.sendResponse(error);
  }
};

Projects.prototype.getProjectsForQuery = function(filters) {
  console.log("Getting projects for query");

  this.offset = 0;

  var query = ""+filters[i];
  if(filters.length > 1) {
    for(j=1;j<filters.length;j++) {
      query += " "+filters[j];
    }
  }

  this.getProjectsPromise(query).then((response) => this.processProjectsResponse(query,response));
};

Projects.prototype.getProjectsPromise = function(query) {
  return axios.get("https://www.freelancer.com/api/projects/0.1/projects/active/?or_search_query="+query+"&limit=4"+"&offset="+this.offset);
};

Projects.prototype.processProjectsResponse = function(filter, resp) {
  var json = resp.data;
  var status = json.status;
  if(status==='success'){
    console.log("It is a success");
    var projects = json.result.projects;
    //console.log(projects);
    var items = [];
    console.log("Items count : "+projects.length);
    for(i=0;i<projects.length;i++) {
      var project = projects[i];
      items.push({title:project.name,subtitle:project.description,
      buttons: [
        {
          type: "postback",
          title: "View",
          payload: "PROJECT."+project.id,
        }
      ]});
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
    console.log("Sending successfull response");
    //console.log(items);
    this.sendResponse(response);
  } else {
    console.log("It is an error");
    var error = {
      recipient: {
        id: this.recipientId
      },
      message: {
        text: "There was an error getting projects"
      }
    };
    this.sendResponse(error);
  }
};

Projects.prototype.sendResponse = function(messageData) {
  console.log("Sending response back");
  this.response.callSendAPI(messageData);
};

module.exports = Projects;
