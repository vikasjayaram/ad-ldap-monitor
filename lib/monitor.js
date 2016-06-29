'use strict';

const nconf = require('nconf');
const moment = require('moment');
const request = require('request');
const mailer = require('./mailer');
const statusCodes = require('http').STATUS_CODES;

/*
    Monitor Constructor
*/
function Monitor (opts) {
    //holds v1 token after client grant

    this.token = '';

    // holds connector name to be monitored
    this.connection = '';

    // check intervals in minutes
    this.timeout = 15;

    // interval handler
    this.handle = null;

    // initialize the app
    this.init(opts)
}

/*
    Methods
*/

Monitor.prototype = {

    init: function (opts) {
        var self = this;

        self.token = opts.token;

        self.connection = opts.connection;

        self.timeout = (opts.timeout * (60 * 1000));

        // start monitoring
        self.start();
    },




    start: function () {
        var self = this,
            time = Date.now();

        console.log("\nLoading... " + self.connection + "\nTime: " + self.getFormatedDate(time) + "\n");

        // create an interval for pings
        self.handle = setInterval(function () {
            self.monitor();
        }, self.timeout);
    },




    stop: function () {
        console.log("Stop monitoring " + this.connection);
        clearInterval(this.handle);
        this.handle = null;
    },




    monitor: function () {
        var self = this, currentTime = Date.now();

        try {
            // send request
            var monitorUrl = "https://" + nconf.get('auth0_domain') + "/api/connections/" + self.connection + "/socket";
            var authorizationToken = 'Bearer ' + self.token;
            request(monitorUrl, { headers: { 'Authorization': authorizationToken} }, function (error, res, body) {
                // connector is up
                if (!error && res.statusCode === 200) {
                    self.isOk();
                }
                // No error but connector not ok
                else {
                    self.isNotOk(res.statusCode, body);
                }
            });
        }
        catch (err) {
            self.isNotOk();
        }
    },




    isOk: function () {
        this.log('UP', 'OK');
    },




    isNotOk: function (statusCode, errorMessage) {
        var time =  Date.now(),
            self = this,
            time = self.getFormatedDate(time),
            msg = '';

      switch (statusCode) {
        case 404:
          msg = 'The connector is offline.';
          break;
        case 200:
          msg = "The connector is online.";
          break;
        default:
          msg = "The connector is in a unknown state.";

      }

        var htmlMsg = '<p>Time: ' + time;
            htmlMsg +='</p><p>AD/LDAP Connector: ' + self.connection;
            htmlMsg += '</p><p>Message: ' + msg + '</p>';
            htmlMsg += '</p><p>Error Message: ' + errorMessage + '</p>';
            htmlMsg += '<p>Status Code: ' + statusCode + "</p>";

        this.log('DOWN', msg);

        // Send yourself an email
        mailer({
            subject: self.connection + ' is down',
            body: htmlMsg
        }, function (error, res) {
            if (error) {
                console.log(error);
            }
        });
    },




    log: function (status, msg) {
        var self = this,
            time = Date.now(),
            output = '';

        output += "\Connection: " + self.connection;
        output += "\nTime: " + self.getFormatedDate(time);
        output += "\nStatus: " + status;
        output += "\nMessage:" + msg  + "\n";

        console.log(output);
    },




    getFormatedDate: function (time) {
        var currentDate = moment(new Date(time)).format('MMMM Do YYYY, h:mm:ss a');
        return currentDate;
    }
}

module.exports = Monitor;
