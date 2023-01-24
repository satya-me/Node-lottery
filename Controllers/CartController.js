const jwt = require("jsonwebtoken");
const Cart = require("../Models/Cart");
const Ticket = require("../Models/Admin/Ticket");

exports.addCart = (req, res, next) => {
  const user_id = req.body.user_id;
  const product_id = req.body.product_id;
  const quantity = req.body.qty;

  const updateProductQuantity = async (user_id, product_id, quantity) => {
    try {
      // check if product already exists
      const product = await Cart.findOne({
        user_id: user_id,
        product_id: product_id,
      });
      if (product) {
        console.log("update");
        // update quantity if product already exists
        const back = await Cart.updateOne(
          { user_id: user_id, product_id: product_id },
          { $inc: { quantity: quantity } }
        );
        res.status(201).json(back);
      } else {
        console.log("new");
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

  updateProductQuantity(user_id, product_id, quantity);
};

exports.getCart = (req, res, next) => {
  // console.log((req.headers.authorization).split(" ")[1]);
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  // console.log(decoded.userId, req.params.user_id);
  if (decoded.userId === req.params.user_id) {
    Cart.find({ user_id: req.params.user_id }).then((resp) => {
      let pids = resp.map((item) => item.product_id);

      Ticket.find(
        {
          _id: {
            $in: pids,
          },
        },
        function (err, docs) {
          res.status(200).json(docs);
        }
      );
    });
  } else {
    res.status(401).json("Authorization failed");
  }
  //
};
