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
var query = "";
var category = "";

function Projects() {
  console.log("Instantiated Projects");
  this.message = "";
  this.response = new Response();
  this.that = this;
}

Projects.prototype.setRecipient = function(recipientId) {
  this.recipientId = recipientId;
};

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

  var query = "";
  for(i=0;i<filters.length;i++) {
    query = query.concat(filters[i]);
    query = query.concat(" ");
  }
  query = query.trim();

  this.query = query;

  this.getProjectsPromise(query).then((response) => this.processProjectsResponse(query,response));
};

Projects.prototype.getProjectsForCategory = function(category) {
  console.log("Getting projects for category");

  this.offset = 0;
  this.category = category;

  this.getProjectsByCategoryPromise(category).then((response) => this.processProjectsByCategoriesResponse(category,response));
};

Projects.prototype.getProjectsPromise = function(query) {
  console.log("QUERY IS : "+"https://www.freelancer.com/api/projects/0.1/projects/active/?or_search_query="+query+"&limit=4"+"&offset="+this.offset);
  return axios.get("https://www.freelancer.com/api/projects/0.1/projects/active/?or_search_query="+query+"&limit=4"+"&offset="+this.offset);
};

Projects.prototype.getProjectsByCategoryPromise = function(category) {
  console.log("QUERY IS : "+"https://www.freelancer.com/api/projects/0.1/projects/active/?project_types[]="+category+"&limit=4"+"&offset="+this.offset);
  return axios.get("https://www.freelancer.com/api/projects/0.1/projects/active/?project_types[]="+category+"&limit=4"+"&offset="+this.offset);
};

Projects.prototype.processProjectsByCategoriesResponse = function(category, resp) {
  var status = json.status;
  if(status==='success'){
    console.log("It is a success");
    var projects = json.result.projects;
    //console.log(projects);
    var items = [];
    //console.log(projects[0]);
    for(i=0;i<projects.length;i++) {
      var project = projects[i];
      items.push({title:project.title,subtitle:project.preview_description,
      buttons: [
        {
          type: "postback",
          title: "View",
          payload: "PROJECT."+project.id,
        }
      ]});
    }
    var newOffset = this.offset+4;
    items.push({title:"Do you want to view more projects ?",
      buttons: [
        {
          type: "postback",
          title: "View more",
          payload: "PROJECT_MORE_CATEGORY."+this.category+"."+newOffset
        }
      ]
    });
    //console.log(items);
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

Projects.prototype.processProjectsResponse = function(filter, resp) {
  var json = resp.data;
  var status = json.status;
  if(status==='success'){
    console.log("It is a success");
    var projects = json.result.projects;
    //console.log(projects);
    var items = [];
    //console.log(projects[0]);
    for(i=0;i<projects.length;i++) {
      var project = projects[i];
      items.push({title:project.title,subtitle:project.preview_description,
      buttons: [
        {
          type: "postback",
          title: "View",
          payload: "PROJECT."+project.id,
        }
      ]});
    }
    var newOffset = this.offset+4;
    items.push({title:"Do you want to view more projects ?",
      buttons: [
        {
          type: "postback",
          title: "View more",
          payload: "PROJECT_MORE_QUERY."+this.query+"."+newOffset
        }
      ]
    });
    //console.log(items);
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

Projects.prototype.isProjectsPostback = function(payload) {
   if(payload.includes("PROJECT") || payload.includes("CATEGORY")) {
     if(payload.includes("PROJECT_MORE_QUERY")) {
       this.handleViewMoreButtonClick(payload);
     } else if(payload.includes("CATEGORY")) {
       this.handleViewCategoryButtonClick(payload);
     } else {
       this.handleViewProjectButtonClick(payload);
     }

     return true;
   } else {
     return false;
   }
};

Projects.prototype.handleViewProjectButtonClick = function(payload) {
  console.log("Clicked on view project");
};

Projects.prototype.handleViewCategoryButtonClick = function(payload) {
  console.log("Clicked on view category");

  var words = payload.split(".");
  this.category = words[1];

  this.getProjectsForCategory(this.category);
};

Projects.prototype.handleViewMoreButtonClick = function(payload) {
  console.log("Clicked on view more projects");

  var words = payload.split(".");
  this.query = words[1];
  this.offset = words[2];

  this.getProjectsPromise(this.query).then((response) => this.processProjectsResponse(this.query,response));
};

Projects.prototype.sendResponse = function(messageData) {
  console.log("Sending response back");
  this.response.callSendAPI(messageData);
};

module.exports = Projects;
