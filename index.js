/*
* Primary file for the API.
 */

// Dependencies~
const HTTP = require("http");
const URL = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const ENV = require("./config");

const servers = {};

// Instantiate the HTTP server:
servers.http = HTTP.createServer((req, res) => {
  handleRequest(req, res);
});

// Start the HTTP server:
servers.http.listen(ENV.ports.http, () => {
  console.log(`The server is listening on port ${ENV.ports.http}.`)
})

// All the server logic for both http and https server.
const handleRequest = function(req, res) {
  // Get the URL and parse it:
  const url = URL.parse(req.url, true);
  // Get the path:
  const path = url.pathname.replace(/^\/+|\/+$/g, '');
  // Get the query string as an object:
  const query = url.query;
  // Get the HTTP Method:
  const method = req.method.toUpperCase();
  // Get the headers as an object:
  const headers = req.headers;
  // Get the payload, if any:
  const decoder = new StringDecoder("utf-8");
  let buffer = String()
  req.on("data", data => {
    buffer += decoder.write(data);
  });
  req.on("end", () => {
    buffer += decoder.end();
    // Choose the handler this request should go to. If one is not found, user the notFound handler:
    const handler = router[path] || handlers.notFound;
    // Construct the data object to send to the handler:
    const data = {
      "path": path,
      "query": query,
      "method": method,
      "headers": headers,
      "payload": buffer
    }
    // Route the request to the handler specified in the router:
    handler(data, (statusCode, payload) => {
      payload = payload || {};
      // Convert the payload to a string:
      const payloadString = JSON.stringify(payload);
      // Return the response:
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
      // Log:
      console.log("Returning this response: ", statusCode, payloadString)
    });
  });
}


// Define the handlers:
const handlers = {};
handlers.hello = (data, callback) => {
  // Callback a HTTP status code, and a payload object:
  callback(200, {"data": data, "message": "Hello World! Welcome to the API built for the Homework Assignment #1: Hello World API!"});
}
handlers.notFound = (data, callback) => {
  callback(404);
}

// Define a request router:
const router = {
  "hello": handlers.hello
}


