const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const Admin = require("../../Models/Admin/Admin");
const Ticket = require("../../Models/Admin/Ticket");
const Category = require("../../Models/Category");
const fs = require("fs");
const path = require("path");
const { find } = require("../../Models/Admin/Admin");
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
            expiresIn: "48h",
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
  // console.log(req.files.image[0].destination);
  // console.log("images/uploads/ticket/" + req.files.image[0].filename);
  // return;
  let list_image = [];
  if (req.files.list_image) {
    for (let j = 0; j < req.files.list_image.length; j++) {
      // list_image.push(
      //   req.files.list_image[j].destination +
      //   "/" +
      //   req.files.list_image[j].filename
      // );
      list_image.push(
        "images/uploads/ticket/" + req.files.list_image[j].filename
      );
      console.log("images/uploads/ticket/" + req.files.list_image[j].filename);
    }
  }
  // console.log(list_image);
  // return;
  const feature = [];
  if (req.body.specifications_key) {
    for (let i = 0; i < req.body.specifications_key.length; i++) {
      feature.push({
        key: req.body.specifications_key[i],
        value: req.body.specifications_value[i],
      });
    }
  }
  const ticket = new Ticket({
    ticket_name: req.body.ticket_name,
    ticket_price: req.body.ticket_price,
    discount_percentage: req.body.discount_percentage,
    currency: req.body.currency,
    ticket_quantity: req.body.ticket_quantity,
    time_left: req.body.time_left,
    main_image: "images/uploads/ticket/" + req.files.image[0].filename,
    list_image: list_image,

    description: req.body.description,
    // specification: req.body.key_feature,
    highlights: req.body.highlights,
    specification: feature,
    // key: req.body.features_key, value: req.body.features_value

    status: req.body.status,
    is_promo: Boolean(req.body.is_promo),
    is_banner: Boolean(req.body.is_banner),
    flag: Boolean(req.body.flag),
    category: req.body.category,
    brand: req.body.brand,
    country_id: req.body.country_id,
  });

  ticket
    .save()
    .then((back) => {
      res.status(201).json({
        message: "Ticket created successfully!",
        info: {
          id: back._id,
          name: back.ticket_name,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.addCategory = (req, res, next) => {
  const category = new Category({
    name: req.body.name,
    image: req.files.image[0].destination + "/" + req.files.image[0].filename,
  });
  category
    .save()
    .then((resp) => {
      res.status(201).json(resp);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
  //
};

exports.getCategory = (req, res, next) => {
  Category.find({})
    .then((resp) => {
      const url = req.protocol + "://" + req.get("host");

      const modifiedResponse = resp.map((category) => {
        return {
          ...category._doc,
          image: `${url}/${category.image}`,
          status: true,
        };
      });
      res.status(200).json(modifiedResponse);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
