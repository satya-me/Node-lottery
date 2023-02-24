const jwt = require("jsonwebtoken");
const Cart = require("../Models/Cart");
const Ticket = require("../Models/Admin/Ticket");
const Order = require("../Models/Order");
const wallet = require("../Models/Wallet");
const { all } = require("axios");

exports.addCart = async (req, res) => {
  const user_id = req.body.user_id;
  const product_id = req.body.product_id;
  const quantity = req.body.qty;
  // cart query using user_id and product_id

  if (quantity > 5) {
    res.status(200).json({
      message: "Sorry, You can buy maximum 5 or Less-than at a time",
      quantity: quantity,
    });
  } else {
    const updateProductQuantity = async (user_id, product_id, quantity) => {
      try {
        // check if product already exists
        const product = await Cart.findOne({
          user_id: user_id,
          product_id: product_id,
        });
        if (product) {
          console.log(product.quantity);
          if (product.quantity == 5) {
            res.status(200).json({
              message: "Sorry, You can buy maximum 5 or Less-than at a time",
              quantity: quantity,
            });
            return;
          }
          console.log("update cart");
          // update quantity if product already exists
          const back = await Cart.updateOne(
            { user_id: user_id, product_id: product_id },
            { $inc: { quantity: quantity } }
          );
          console.log({ back, msg: "update car" });
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
          console.log({ back, message: "Ticket added successfully!" });
          res.status(201).json({ message: "Ticket added successfully!" });
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
    res.status(200).json({
      message: "Sorry, You can buy maximum 5 or Less-than at a time",
      quantity: quantity,
    });
  } else {
    if (quantity >= 1 || quantity > 5) {
      if (req.auth.userId === decoded.userId) {
        console.log({ user_id: decoded.userId, _id: ticket_id });
        Cart.updateOne(
          { user_id: decoded.userId, _id: ticket_id },
          { $set: { quantity: quantity } }
        )
          .then((success) => {
            res.status(200).json({
              success,
              message: "Ticket quantity update successfully!",
            });
          })
          .catch((err) => {
            res.status(500).json({ err, message: "Can't handle request!" });
          });
      }
    } else {
      res.status(200).json({ message: "Quantity can't be zero!" });
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
            console.log(resp);
            res.status(200).json({ message: "One item removed!" });
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
  if (!all_product) {
    console.log("no");
    res
      .status(500)
      .json({ error: "true", message: "unable to handel the request" });
    return;
  }

  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "RANDOM_TOKEN_SECRET");

  const user_id = decoded.userId;
  // return;
  let meta = [];
  let error = "false";
  // console.log("hi");
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
    let tP = [];
    let krt_id = [];
    for (const cd of all_product) {
      let tot_pri = cd.ticket_price * cd.quantity;
      let disc = cd.discount_percentage;
      let total_discount_price;
      console.log(cd);
      if (disc) {
        total_discount_price = +(
          (cd.ticket_price - (cd.ticket_price * disc) / 100) *
          cd.quantity
        ).toFixed(2);
      } else {
        total_discount_price = +(cd.ticket_price * cd.quantity).toFixed(2);
      }
      tP.push(total_discount_price);
      krt_id.push(cd.id);
      const newOrder = new Order({
        user_id: user_id,
        product_id: cd.product_id,
        unit_price: cd.ticket_price,
        quantity: cd.quantity,
        discount: cd.discount_percentage,
        total_price: tot_pri,
        total_discount_price: total_discount_price,
        other_info: "",
      });
      console.log("before save ");

      let saveOrder = await newOrder.save();
      try {
        let up = +cd.quantity;
        await Ticket.updateOne(
          { _id: cd.product_id },
          { $inc: { ticket_quantity: -up } }
        );
      } catch (error) {
        console.log(error);
      }
      console.log("after save");
    }
    console.log(tP); //when success it print.
    const sum = tP.reduce((total, currentValue) => total + currentValue, 0);
    console.log("Bal ", sum);
    wallet.find({ user_id: user_id }).then((isBal) => {
      if (isBal[0].balance > sum) {
        wallet.updateOne(
          { user_id: user_id },
          { $inc: { balance: (-sum).toFixed(2) } },
          (err, result) => {
            if (err) throw err;
            console.log(
              result.modifiedCount === 1
                ? "Wallet updated successfully"
                : "Wallet not found"
            );
          }
        );
        console.log(krt_id);
        Cart.deleteMany({ _id: { $in: krt_id } }, function (err) {
          if (err) return err;
          console.log("Cart clear successfully.");
        });
        res.status(200).json({ error: "false", message: "Order success" });
      } else {
        res
          .status(200)
          .json({ error: "true", message: "insufficient ballance" });
      }
    });
  }
};

exports.BuyNow = async (req, res) => {
  //
  console.log(req.body);
  // return;
  const product = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const user_id = decoded.userId;
  if (!product && user_id == "") {
    console.log({ error: "true", message: "unable to handel the request" });
    res
      .status(500)
      .json({ error: "true", message: "unable to handel the request" });
    return;
  }

  let meta = [];
  let error = "";
  try {
    const docs = await Ticket.find({ _id: product.product_id }).exec();
    if (product.quantity > docs[0].ticket_quantity) {
      error = "true";
      meta.push({
        pro_id: product.product_id,
        quantity: product.quantity + " Asking quantity is not available!",
      });
    }
    if (error == "true") {
      console.log({ error: error, meta });
      res.status(200).json({ error: error, meta });
    }

    const newOrder = new Order({
      user_id: user_id,
      product_id: product.product_id,
      unit_price: product.unit_price,
      quantity: product.quantity,
      discount: product.discount,
      total_price: product.total_price,
      total_discount_price: product.total_discount_price,
      other_info: "",
    });
    if (newOrder.save()) {
      try {
        let ticket = await Ticket.findById({ _id: product.product_id });
        ticket.ticket_quantity -= product.quantity;
        await ticket.updateOne({ ticket_quantity: ticket.ticket_quantity });
      } catch (error) {
        console.log(error);
      }
      wallet.find({ user_id: user_id }).then((isBal) => {
        if (isBal[0].balance > product.total_discount_price) {
          wallet.updateOne(
            { user_id: user_id },
            { $inc: { balance: (-product.total_discount_price).toFixed(2) } },
            (err, result) => {
              if (err) throw err;
              console.log(
                result.modifiedCount === 1
                  ? "Wallet updated successfully"
                  : "Wallet not found"
              );
            }
          );

          res.status(200).json({ error: "false", message: "Order success" });
          return;
        } else {
          res
            .status(200)
            .json({ error: "true", message: "insufficient ballance" });
          return;
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
  // res.status(200).json({ error: error, message: "Order success" });
  // res.status(200).json({ error: "true", message: "Order unsuccess" });
};

exports.OrderHistory = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const orderDocs = await Order.find({ user_id: decoded.userId });
    var modifiedResponse = await Promise.all(
      orderDocs.map(async (ticket) => {
        let Tid = await Ticket.findOne({ _id: ticket.product_id });
        return {
          ...ticket._doc,
          ticket_name: Tid.ticket_name,
          image_link: Tid.main_image,
          image_path: Tid.main_image,
          time_left: Tid.time_left,
        };
      })
    );
    res.status(200).json(modifiedResponse);
  } catch (error) {
    res.status(401).json({ message: "Invalid JWT" });
  }
};
