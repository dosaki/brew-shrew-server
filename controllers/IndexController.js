var fs = require('fs');
var kettleService = require("../services/KettleService");

function start(response) {
  kettleService.listRequests(function(requestList){
    response.writeHead(200, {"Content-Type": "text/html"});

    var htmlList = "";
    for(var i = 0; i < requestList.length; i++){
      htmlList = htmlList + "<li>" + requestList[i].personName + " - " + requestList[i].brewName + "</li>"
    }

    response.write("<h2>Requests: </h2><ul>" + htmlList + "</ul>");
    response.end();
  });
}

function replyWithTextFile(response, filePath, type){
  var content = fs.readFileSync(filePath);
  response.writeHead(200, {"Content-Type": "text/"+type});
  response.write(content);
  response.end();
}

function makeRequest(response) {
  replyWithTextFile(response, 'views/makeRequest.html', 'html');
}

function favicon(response) {
  var img = fs.readFileSync('images/icon.png');
  response.writeHead(200, {"Content-Type": "image/x-icon"});
  response.end(img,'binary');
}

function brewRequester(response) {
  replyWithTextFile(response, 'views/brewRequester.js', 'javascript');
}

function cookies(response) {
  replyWithTextFile(response, 'views/cookies.js', 'javascript');
}

function styles(response) {
  replyWithTextFile(response, 'views/styles.css', 'plain');
}

exports.start = start;
exports.makeRequest = makeRequest;
exports.brewRequester = brewRequester;
exports.cookies = cookies;
exports.styles = styles;
exports.favicon = favicon;
