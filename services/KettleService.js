var db = require("../datasource/db");
var Brewer = db.Brewer;
var BrewRequest = db.BrewRequest;


function doneServing(){
  getBrewer(function(brewer){
    if(brewer){
      return brewer.updateAttributes({
        name: ''
      });
    }
  });

  //I want to clear everything in the table, so we might as well drop and remake it all together
  BrewRequest.sync({force: true});
}

function saveBrewer(name){
  return getBrewer(function(brewer){
    if(brewer){
      return brewer.updateAttributes({
        name: name
      });
    }
    else{
      var b = Brewer.build({
        name: name
      });
      b.save();
    }
  });
}

function saveBrewRequest(brew, name){
  return getBrewRequestByName(name, function(brewRequest){
    if(brewRequest){
      return brewRequest.updateAttributes({
        brewName: brew,
        personName: name
      });
    }
    else{
      var b = BrewRequest.build({
        brewName: brew,
        personName: name
      });
      b.save();
    }
  });
}

function getBrewer(callback){
  return Brewer.findOne().then(
    function(brewer){
      callback(brewer);
    });
}

function listRequests(callback){
  return BrewRequest.findAll().then(
    function(brewRequests){
      callback(brewRequests);
    });
}

function getBrewRequestByName(name, callback){
  return BrewRequest.findOne({where:{personName: name}}).then(
    function(brewRequest){
      callback(brewRequest);
    });
}

exports.saveBrewer = saveBrewer;
exports.getBrewer = getBrewer;

exports.saveBrewRequest = saveBrewRequest;
exports.getBrewRequestByName = getBrewRequestByName;

exports.doneServing = doneServing;
exports.listRequests = listRequests;
