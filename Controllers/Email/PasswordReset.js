const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const d = new Date();

exports.UserPasswordEmailNotification = (req, token) => {
  console.log("Email ", req);
  var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: +process.env.EMAIL_PORT,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  var mailOptions = {
    from: '"📧 Lottery App 👻" <kotai.workalert@gmail.com>',
    to: req,
    subject: "✅ Mail sent using Node.js",
    text: "That was easy!",
    html:
      '<a href="' +
      process.env.HOST +
      "/api/auth/new-password/" +
      token +
      '">Set new password!</a>',
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send({
        message: "Email sent: " + info.response,
      });
    }
  });
};
