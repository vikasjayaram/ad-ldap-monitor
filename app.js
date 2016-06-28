'use strict';

const nconf = require('nconf');
const authenticate = require('./lib/authenticate');
const Monitor = require('./lib/monitor');
const connectors = require('./connectors');
const http = require('http');
const port = process.env.PORT || 3008;
const connectors_list = [], monitors = [];
const logger = require('./logger');

let server = null;
// Read the config.
nconf
  .file({ file: './config.json' })
  .argv()
  .env();

authenticate(function(err, token) {
  console.log(token);
  if (err) {
    logger.error('Error authenticating:', err.message);

  }

  connectors.forEach(function (connector) {
      var monitor_connector = new Monitor ({
          token: token,
          connection: connector.name,
          timeout: connector.timeout
      });

      connectors_list.push(connector.name);
      monitors.push(monitor_connector);
  });
});


server = http.createServer(function (req, res) {
    var data = "Monitoring the following connectors: \n \n" + connectors_list.join("\n");

    res.end(data);
});


server.listen(port);
console.log('Listening to port %s', port);
