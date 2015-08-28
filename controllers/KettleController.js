var kettleService = require("../services/KettleService");

function isEmpty(value){
  return value === undefined || value === null || value === "" || value.length === 0
}

function addBrew(response, data) {
  if(!isEmpty(data.brewName) && !isEmpty(data.personName)) {
    kettleService.saveBrewRequest(data.brewName, data.personName)
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("ok");
  }
  else{
    response.writeHead(400, {"Content-Type": "text/plain"});
    response.write("Missing information. (Brew: " + data.brewName + "; Person: " + data.personName + ")");
  }
  response.end();
}

function turnOn(response, data) {
  if(!isEmpty(data.personName)) {
    kettleService.getBrewer(function(brewer){
      response.writeHead(200, {"Content-Type": "text/plain"});
      if(isEmpty(brewer) || isEmpty(brewer.name)){
        kettleService.saveBrewer(data.personName);
        response.write("ok");
      }
      else{
        response.write("fail:" + brewer.name);
      }
      response.end();
    });
  }
  else{
    response.writeHead(400, {"Content-Type": "text/plain"});
    response.write("Missing information. (Person: " + data.personName + ")");
    response.end();
  }
}

function brewer(response, data) {
  kettleService.getBrewer(function(brewer){
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(brewer.name);
    response.end();
  });
}

function doneServing(response, data){
  kettleService.doneServing();
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("ok");
  response.end();
}

exports.addBrew = addBrew;
exports.turnOn = turnOn;
exports.brewer = brewer;
exports.doneServing = doneServing;
