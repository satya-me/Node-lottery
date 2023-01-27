const jwt = require("jsonwebtoken");
const Cart = require("../Models/Cart");
const Ticket = require("../Models/Admin/Ticket");

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
        res.status(500).json("Item not found!");
        // return;
      } else {
        Cart.deleteOne({ _id: id })
          .then((resp) => {
            res.status(500).json("One item removed!");
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      }
    });
  }
};
