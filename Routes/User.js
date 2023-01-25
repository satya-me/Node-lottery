const express = require("express");
const multer = require("../Middleware/Multer");
const router = express.Router();
const auth = require("../Middleware/AuthUser");
const userCtrl = require("../Controllers/UserController");
const accountCtrl = require("../Controllers/AccountController");
const cart = require("../Controllers/CartController");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.post("/forget", userCtrl.forgetPassword); //enter email
router.post("/new-password/save", userCtrl.newPasswordSave);

// this route called from email
router.get("/new-password/:token", userCtrl.newPasswordByEmailForm);

router.post(
  "/wallet/recharge",
  multer.singleImageUpload.single("photos"),
  auth,
  accountCtrl.recharge
);
router.get("/account/wallet/balance", auth, accountCtrl.balance);
router.post(
  "/add-cart",
  multer.singleImageUpload.single("photos"),
  auth,
  cart.addCart
);
router.get("/cart/:user_id", auth, cart.getCart);

router.get("/cart/delete/:ticket_id", auth, cart.getCart);

module.exports = router;
