'use strict';

const nconf = require('nconf');
const authenticate = require('./lib/authenticate');
const Monitor = require('./lib/monitor');
const connectors = require('./connectors');
const http = require('http');
const port = process.env.PORT || 3008;
const logger = require('./logger');
let connectors_list = [], monitors = [];

let server = null;
// Read the config.
nconf
  .file({ file: './config.json' })
  .argv()
  .env();

const monitor_connectors = function () {
  authenticate(function(err, token) {
    if (err) {
      logger.error('Error authenticating:', err.message);
    }
    if (monitors.length > 0) {
      monitors.forEach(function (monitor) {
        monitor.stop();
      });
    }
    connectors_list = [], monitors = [];
    connectors.forEach(function (connector) {
      if (connector.timeout != undefined && connector.timeout > 0) {
        var monitor_connector = new Monitor ({
            token: token,
            connection: connector.name,
            timeout: connector.timeout
        });

        connectors_list.push(connector.name);
        monitors.push(monitor_connector);
      } else {
        logger.error('The timeout value should be defined and must be greater than 0');
        process.exit(1);
      }
    });
    return next();
  });
}

const next = function() {
  // Run every 30 minutes
  setTimeout(monitor_connectors, 30000);
}

server = http.createServer(function (req, res) {
    var data = "Monitoring the following connectors: \n \n" + connectors_list.join("\n");
    res.end(data);
});



server.listen(port);
monitor_connectors();
console.log('Listening to port %s', port);
