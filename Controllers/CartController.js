const jwt = require("jsonwebtoken");
const Cart = require("../Models/Cart");
const Ticket = require("../Models/Admin/Ticket");
const Order = require("../Models/Order");
const { all } = require("axios");

exports.addCart = (req, res) => {
  const user_id = req.body.user_id;
  const product_id = req.body.product_id;
  const quantity = req.body.qty;
  if (quantity > 5) {
    res
      .status(200)
      .json({ message: "Sorry, You can buy maximum 5 or Less-than at a time" });
  } else {
    const updateProductQuantity = async (user_id, product_id, quantity) => {
      try {
        // check if product already exists
        const product = await Cart.findOne({
          user_id: user_id,
          product_id: product_id,
        });
        if (product) {
          console.log("update cart");
          // update quantity if product already exists
          const back = await Cart.updateOne(
            { user_id: user_id, product_id: product_id },
            { $inc: { quantity: quantity } }
          );
          res.status(201).json(back);
        } else {
          console.log("new cart");
          // insert new product if it doesn't exist
          const newProduct = new Cart({
            user_id: user_id,
            product_id: product_id,
            quantity: quantity,
          });
          const back = await newProduct.save();
          res.status(201).json(back);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    if (decoded.userId === user_id) {
      updateProductQuantity(user_id, product_id, quantity);
    }
  }
};

exports.updateCart = (req, res) => {
  //
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const ticket_id = req.params.ticket_id;
  const quantity = req.params.quantity;
  if (quantity > 5) {
    res
      .status(200)
      .json({ message: "Sorry, You can buy maximum 5 or Less-than at a time" });
  } else {
    if (req.auth.userId === decoded.userId) {
      Cart.updateOne(
        { user_id: decoded.userId, _id: ticket_id },
        { $set: { quantity: quantity } }
      )
        .then((success) => {
          res
            .status(200)
            .json({ success, message: "Ticket quantity update successfully!" });
        })
        .catch((err) => {
          res.status(500).json({ err, message: "Can't handle request!" });
        });
    }
  }
};

exports.getCart = (req, res) => {
  // console.log((req.headers.authorization).split(" ")[1]);
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  if (decoded.userId === req.params.user_id) {
    Cart.find({ user_id: req.params.user_id }).then((resp) => {
      let pidsPromises = resp.map((item) => {
        return Ticket.find({ _id: item.product_id });
      });
      Promise.all(pidsPromises)
        .then((pids) => {
          let finalResult = resp.map((r, index) => {
            return {
              resp: r,
              info: pids[index],
            };
          });
          res.status(200).json(finalResult);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } else {
    res.status(401).json("Authorization failed");
  }
  //
};

exports.deleteCart = (req, res, next) => {
  const id = req.params.cart_id;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  // console.log("From Fun ",req.headers);
  if (decoded.userId === req.auth.userId) {
    Cart.findOne({ _id: id }).then((isCart) => {
      // console.log(isCart);
      if (isCart === null) {
        res
          .status(500)
          .json({ message: "Item not found. or removed from cart!" });
        // return;
      } else {
        Cart.deleteOne({ _id: id })
          .then((resp) => {
            res.status(500).json({ message: "One item removed!" });
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      }
    });
  }
};

exports.OrderPlace = async (req, res) => {
  const all_product = req.body.product_info;
  console.log(typeof all_product);
  // return;
  let meta = [];
  let error = "false";
  console.log("hi");

  for (const element of all_product) {
    const docs = await Ticket.find({ _id: element.product_id }).exec();
    if (docs[0]._id == element.product_id) {
      if (element.quantity > docs[0].ticket_quantity) {
        error = "true";
        meta.push({
          cart_id: element.id,
          pro_id: element.product_id,
          quantity: element.quantity + " Asking quantity is not available!",
        });
      }
    }
  }
  if (error == "true") {
    console.log({ error: error, meta });
    res.status(200).json({ error: error, meta });
  }
  if (error == "false") {
    const order = [];
    for (const kadi of all_product) {
      // console.log({ flag: flag, meta });
      let tot_pri = kadi.ticket_price * kadi.quantity;
      let disc = kadi.discount_percentage;
      let total_discount_price;
      if (disc) {
        total_discount_price =
          ((kadi.ticket_price * disc) / 100) * kadi.quantity;
      } else {
        total_discount_price = kadi.ticket_price * kadi.quantity;
      }

      order.push({
        product_id: kadi.product_id,
        unit_price: kadi.ticket_price,
        quantity: kadi.quantity,
        discount: kadi.discount_percentage,
        total_price: tot_pri,
        // total_discount_price: total_discount_price,
        total_discount_price: total_discount_price,
        // coupon_id: req.body.product_info,

        address: req.body.address.address,
        roadName: req.body.address.roadName,
        pincode: req.body.address.pincode,
        country: req.body.address.country.split("||")[0],
        country_id: req.body.address.country.split("||")[1],
        state: req.body.address.state.split("||")[0],
        state_id: req.body.address.state.split("||")[1],
        other_info: "",
      });
      // order.save().then((sa) => {
      //   res.status(200).json({ flag: flag, meta });
      // });
    }
    console.log(order);
    res.status(200).json(order);
  }
};

//
// console.log(req.body);
// Order address Table
// Order Table
// Transaction History
