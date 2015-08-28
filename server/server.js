var http = require("http");
var url = require("url");

function start(route, handle) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		var getData = url.parse(request.url, true).query;
		route(handle, pathname, response, getData);
	}

	http.createServer(onRequest).listen(8585);
	console.log("Server has started.");
}

exports.start = start;
