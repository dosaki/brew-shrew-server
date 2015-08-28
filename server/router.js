function route(handle, pathname, response, getData) {
	if (typeof handle[pathname] === 'function') {
		handle[pathname](response, getData);
	} else {
		console.log("No request handler found for " + pathname);
		console.log(handle);
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 Not found");
		response.end();
	}
}

exports.route = route;
