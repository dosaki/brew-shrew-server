var server = require("./server/server");
var router = require("./server/router");
var index = require("./controllers/IndexController");
var kettle = require("./controllers/KettleController");

var handle = {}
handle["/"] = index.start;
handle["/favicon.ico"] = index.favicon;
handle["/start"] = index.start;

//Kettle stuff
handle["/kettle/addBrew"] = kettle.addBrew;
handle["/kettle/turnOn"] = kettle.turnOn;
handle["/kettle/brewer"] = kettle.brewer;
handle["/kettle/doneServing"] = kettle.doneServing;

server.start(router.route, handle);
