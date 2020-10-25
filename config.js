/*
* Create and export configuration variables~
 */

// Container for all the environments:
const ENV = {};

// Development (default) environnement:
ENV.DEV = {
  "ports" : {
    "http": 3000,
    "https": 3001
  },
  "name" : "DEV"
};

// Production environnement
ENV.PROD = {
  "ports" : {
    "http": 5000,
    "https": 5001
  },
  "name" : "PRODUCTION"
};

// Determine which environment was passed as a command-line argument:
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.toUpperCase() : "";
// Check that the current environment is one of the environments above, if not, default to staging:
const EXPORT_ENV = ENV[NODE_ENV] || ENV.DEV;

// Export the environment:
module.exports = EXPORT_ENV;

