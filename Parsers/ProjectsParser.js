
var intentKeywords = ['find','search','want'];
var typeKeywords = ['job','project','jobs','projects'];
var filterKeywords = ['website','it','mobile','writing','art','design','data','entry','software','dev',
'contest','pickup','delivery','cleaning','development'
];

var recipientId;

function isSearchingForProjects(senderId, messageText) {
  recipientId = senderId;
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
}

function getResponseForProjectSearch(words) {
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
}

function getAllProjectCategories() {
  $.get("https://www.freelancer.com/api/projects/0.1/job_bundle_categories/", function(data) {
    var status = data.status;
    if(status==="success") {

    } else {

    }
  });
}

function getProjectsForQuery(filters) {

}
