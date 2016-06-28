'use strict';

const nconf = require('nconf');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
let mailer = null

mailer = function (opts, fn) {
    var mailOpts, smtpTrans;
    // nodemailer configuration
    try {
        smtpTrans = nodemailer.createTransport(sgTransport(nconf.get('sendgrid_options')));
    }
    catch (err) {
        fn('Nodemailer could not create Transport', '');
        return;
    }
    // mailing options
    mailOpts = {
        from: nconf.get('from_email_address'),
        to: nconf.get('to_email_address'),
        subject: opts.subject,
        html: opts.body
    };
    // Send maail
    try {
        smtpTrans.sendMail(mailOpts, function (error, response) {
            //if sending fails
            if (error) {
              fn(true, error);
            }
            //Yay!! message sent
            else {
              fn(false, response.message);
            }
        });
    }
    catch (err) {
        fn('Nodemailer could not send Mail', '');
    }
};
module.exports = mailer;
