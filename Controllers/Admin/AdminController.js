const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const Admin = require("../../Models/Admin/Admin");
const Ticket = require("../../Models/Admin/Ticket");
const fs = require("fs");
const path = require("path");
const d = new Date();

exports.signup = (req, res, next) => {
  //
  console.log(req.body);
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new Admin({
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
  Admin.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] })
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
            expiresIn: "24h",
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

exports.addTicket = (req, res, next) => {
  console.log({ file: req.files, body: req.body });
  res.status(201).json(req.files)
  // const ticket = new Ticket({
  //   ticket_name: req.body.ticket_name,
  //   ticket_price: req.body.ticket_price,
  //   currency: req.body.currency,
  //   ticket_quantity: req.body.ticket_quantity,
  //   time_left: req.body.time_left,
  //   main_image: req.body.main_image,
  //   list_image: req.body.list_image,
  //   description: req.body.description,
  //   status: req.body.status,
  //   is_promo: req.body.is_promo,
  //   flag: req.body.flag,
  //   category: req.body.category,
  //   brand: req.body.brand,
  // });
  // ticket
  //   .save()
  //   .then((back) => {
  //     res.status(201).json({
  //       message: "Ticket created successfully!",
  //       info: {
  //         id: back._id,
  //         name: back.ticket_name,
  //       },
  //     });
  //   })
  //   .catch((err) => {
  //     res.status(500).json({
  //       error: err,
  //     });
  //   });
};
