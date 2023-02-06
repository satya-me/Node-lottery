const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const User = require("../Models/User");
const Ticket = require("../Models/Admin/Ticket");
const fs = require("fs");
const path = require("path");
const d = new Date();
const UserEmail = require("../Controllers/Email/PasswordReset");
const { table } = require("console");
exports.signup = (req, res, next) => {
  //
  console.log(req.body);
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      full_name: req.body.full_name,
      // last_name: req.body.last_name,
      email: req.body.email,
      phone: req.body.phone,
      dob: req.body.dob,
      country: req.body.country.split("||")[0],
      country_id: req.body.country.split("||")[1],
      state: "",
      state_id: "",
      city: "",
      zip: "",
      password: hash,
    });
    user
      .save()
      .then((resp) => {
        const filteredResp = {
          // _id: resp._id,
          // full_name: resp.full_name,
          // email: resp.email,
          // phone: resp.phone,
          // dob: resp.dob,

          _id: resp._id,
          full_name: resp.full_name,
          email: resp.email,
          phone: resp.phone,
          dob: resp.dob,
          country: resp.country,
          country_id: resp.country_id,
          state: resp.state,
          state_id: resp.state_id,
          city: resp.city,
          zip: resp.zip,
        };
        res.status(201).json({
          message: "User created successfully",
          res: filteredResp,
        });
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  });
};

exports.login = (req, res, next) => {
  //
  console.log(" Login route " + d);
  // { "$or": [ { email: req.body.email }, { phone: req.body.phone} ] }
  const input = req.body.email || req.body.phone;
  User.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] })
    .then((user) => {
      if (!user) {
        if (!input) {
          return res.status(401).json({
            data: { error: "Please enter email or phone", type: "user" },
          });
        } else {
          return res.status(401).json({
            data: { error: "User not found! with this " + input, type: "user" },
          });
        }
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
            expiresIn: "48h",
          });
          res.status(200).json({
            user_details: {
              user_id: user._id,
              full_name: user.full_name,
              // last_name: user.last_name,
              email: user.email,
              phone: user.phone,
              dob: user.dob,
              country: user.country,
              // city: user.city,
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
  console.log(req.body);
  User.findOne({ email: req.body.email })
    .then((user) => {
      const token = jwt.sign(
        { email_user: user.email },
        "RANDOM_TOKEN_SECRET",
        {
          expiresIn: Math.floor(Date.now() / 1000) + 5 * 60,
        }
      );
      User.findOneAndUpdate(
        { email: user.email },
        { set_pass: token },
        { new: true }
      ).then(() => {
        UserEmail.UserPasswordEmailNotification(user.email, token);
        console.log("link sent to your email " + user.email);
        res.status(200).json({
          message: "link sent to your email " + user.email,
        });
      });
    })
    .catch((err) => {
      res.status(200).json({ error: "Email not found!" });
    });
};

exports.newPasswordSave = (req, res, next) => {
  const decoded = jwt.verify(req.body.token, "RANDOM_TOKEN_SECRET");
  console.log(req.body.password);
  if (decoded.email_user == req.body.email) {
    User.findOne({ email: req.body.email }).then((user) => {
      if (user.set_pass) {
        bcrypt.hash(req.body.password, 10).then((hash) => {
          User.findOneAndUpdate(
            { email: req.body.email },
            { password: hash, set_pass: "" },
            { new: true }
          ).then((resp) => {
            res.redirect(process.env.FRONTEND_HOST);
            // res.status(200).json({ message: "success" });
          });
        });
      } else {
        res.redirect(process.env.FRONTEND_HOST);
        // res.status(200).json({ message: "It's done already" });
      }
    });
  }
};

exports.newPasswordByEmailForm = (req, res, next) => {
  const decoded = jwt.verify(req.params.token, "RANDOM_TOKEN_SECRET");
  const email = decoded.email_user;

  // check set_pass status
  User.findOne({ email: email }).then((resp) => {
    console.log(resp);
    const action_url = req.protocol + "://" + req.get("host");
    res.render("index", {
      url: process.env.HOST + "/api/auth/new-password/save",
      email: resp.email,
      token: resp.set_pass,
      name: resp.full_name,
    });
  });
};

exports.allTickets = (req, res, next) => {
  console.log(req.body);
  let listOfTicket = fs.readFileSync(path.join(__dirname, "../Api/list.json"));
  let list = JSON.parse(listOfTicket);
  Ticket.find({})
    .then((resp) => {
      const url = req.protocol + "://" + req.get("host");

      const modifiedResponse = resp.map((ticket) => {
        return {
          ...ticket._doc,
          is_image: `${ticket.main_image}`,
          main_image: `${url}/${ticket.main_image}`,
        };
      });
      if (resp) res.status(200).json(modifiedResponse);
    })
    .catch((err) => {
      if (err) res.status(200).json(err);
    });
};

exports.ticketById = (req, res, next) => {};

exports.UpdateProfile = async (req, res) => {
  // full_name
  // email
  // phone
  // dob
  // country
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "RANDOM_TOKEN_SECRET");

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: decoded.userId },
      {
        $set: {
          full_name: req.body.full_name,
          email: req.body.email,
          phone: req.body.phone,
        },
      },
      { new: true, select: "-password -set_pass" }
    );
    console.log(updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log("err" + err);
    res.status(500).send(err);
  }

  // console.table(req.body);
};
