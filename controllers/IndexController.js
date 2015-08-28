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
    })
}

function favicon(response) {
    var img = fs.readFileSync('images/icon.png');
    response.writeHead(200, {"Content-Type": "image/x-icon"});
    response.end(img,'binary');
}

exports.start = start;
exports.favicon = favicon;
