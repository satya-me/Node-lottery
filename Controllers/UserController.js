const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const User = require("../Models/User");
const Ticket = require("../Models/Admin/Ticket");
const fs = require("fs");
const path = require("path");
const d = new Date();
exports.signup = (req, res, next) => {
  //
  console.log(req.body);
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone: req.body.phone,
      dob: req.body.dob,
      country: req.body.country,
      city: req.body.city,
      password: hash,
    });
    user
      .save()
      .then((resp) => {
        res.status(201).json({
          message: "User created successfully",
          res: resp,
        });
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  });
};

exports.login = (req, res, next) => {
  //
  console.log(" Login route" + d);
  // { "$or": [ { email: req.body.email }, { phone: req.body.phone} ] }
  const input = req.body.email || req.body.phone;
  User.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          data: { error: "User not found! with this " + input, type: "user" },
        });
      }

      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              data: { error: "Incorrect password!", type: "password" },
            });
          }
          const token = jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "2h",
          });
          res.status(200).json({
            userId: user,
            token: token,
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
            line: "Line 61",
          });
        });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

exports.forgetPassword = (req, res, next) => {
  console.log(req.body);

  User.findOne({ email: req.body.email })
    .then((user) => {
      const token = jwt.sign({ userId: user.email }, "RANDOM_TOKEN_SECRET", {
        expiresIn: "1h",
      });
      res.status(200).json({
        name: user.first_name + " " + user.last_name,
        user: user.email,
        token: token,
      });
    })
    .catch((err) => {
      err;
    });
};

exports.newPasswordByEmail = (req, res, next) => {
  console.log("New Password Set route (Email)" + d);
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
      user: "kotai.workalert@gmail.com",
      pass: "tnnzqsjryiizdncp",
    },
  });

  var mailOptions = {
    from: '"📧 Lottery App 👻" <kotai.workalert@gmail.com>',
    to: "satyajit@kotaielectronics.com",
    subject: "✅ Mail sent using Node.js",
    text: "That was easy!",
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

exports.allTickets = (req, res, next) => {
  console.log(req.body);
  let listOfTicket = fs.readFileSync(path.join(__dirname, "../Api/list.json"));
  let list = JSON.parse(listOfTicket);
  // console.log(punishments);
  const tickets = Ticket.find({}, (err, resp) => {
    if (err) res.status(200).json(err);
    if (resp) res.status(200).json(resp);
  });
  // res.status(200).json(punishments);
};
exports.ticketById = (req, res, next) => {
  //
};
