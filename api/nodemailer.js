const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

let transport = {
            service: "gmail",
            logger: true,
            debug: true,
            auth: {
                //user: "052d66c19eb645",
                //pass: "7e46d40d9dbbcd"
                user:"cerbitojocelyn0948@gmail.com",
                pass: "Analyst!!@@###$$",
            },
        };
let mailTransporter = nodemailer.createTransport(
                                smtpTransport(transport)        
                        );
module.exports = {mailTransporter};