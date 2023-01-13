const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const User = require("../Models/User");
const Ticket = require("../Models/Admin/Ticket");
const fs = require("fs");
const path = require("path");
const d = new Date();
const UserEmail = require("../Controllers/Email/PasswordReset");
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
      state: req.body.state,
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
            user_details: {
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              phone: user.phone,
              dob: user.dob,
              country: user.country,
              city: user.city,
            },
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

// This function send link to email to set new password
exports.forgetPassword = (req, res, next) => {
  // console.log(req.body);
  User.findOne({ email: req.body.email })
    .then((user) => {
      const token = jwt.sign(
        { email_user: user.email },
        "RANDOM_TOKEN_SECRET",
        {
          expiresIn: Math.floor(Date.now() / 1000) + 5 * 60,
        }
      );
      UserEmail.UserPasswordEmailNotification(user.email, token);
      User.findOneAndUpdate(
        { email: user.email },
        { set_pass: token },
        { new: true }
      ).then(() => {
        res.status(200).json({
          name: user.first_name + " " + user.last_name,
          user: user.email,
          token: token,
        });
      });
    })
    .catch((err) => {
      res.status(200).json({ error: "Email not found!" });
    });
};

exports.newPasswordByEmailForm = (req, res, next) => {
  const decoded = jwt.verify(req.params.token, "RANDOM_TOKEN_SECRET");
  const email = decoded.email_user;

  // check set_pass status
  User.findOne({ email: email }).then((resp) => {
    console.log(resp);
    res.locals.email = resp.email;
    res.locals.name = resp.first_name + " " + res.last_name;
    res.sendFile(path.join(__dirname, "../Views", "setPass.html"));
  });

  // res.status(200).json("Form");
};

exports.newPasswordSave = (req, res, next) => {
  console.log(req);
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
