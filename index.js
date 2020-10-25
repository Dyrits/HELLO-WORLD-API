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
  proceed(req, res);
});

// Start the HTTP server:
servers.http.listen(ENV.ports.http, () => {
  console.log(`The server is listening on port ${ENV.ports.http}.`)
})

// All the server logic for both http and https server.
const proceed = function(req, res) {
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
    handler(data, (status, payload) => {
      payload = payload || {};
      // Convert the payload to a string:
      payload = JSON.stringify(payload);
      // Return the response:
      res.setHeader("Content-Type", "application/json");
      res.writeHead(status);
      res.end(payload);
      // Log:
      console.log("Returning this response:", status, payload)
    });
  });
}


// Define the handlers:
const handlers = {};
handlers.hello = (data, callback) => {
  // Callback a HTTP status code, and a payload object:
  callback(200, {"request": data, "message": "Hello World! Welcome to the API built for the Homework Assignment #1: Hello World API!"});
}
handlers.notFound = (data, callback) => {
  callback(404);
}

// Define a request router:
const router = {
  "hello": handlers.hello
}


