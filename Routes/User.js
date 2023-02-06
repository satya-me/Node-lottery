const express = require("express");
const router = express.Router();
const auth = require("../Middleware/AuthUser");
const multer = require("../Middleware/Multer");
const userCtrl = require("../Controllers/UserController");
const accountCtrl = require("../Controllers/AccountController");
const cart = require("../Controllers/CartController");
const { route } = require("./ticket");
const UseLess = require("../Middleware/Useless");

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
  accountCtrl.Recharge
);
router.get("/account/wallet/balance", auth, accountCtrl.balance);
router.post(
  "/add-cart",
  multer.singleImageUpload.single("photos"),
  auth,
  cart.addCart
);
router.get("/cart/:user_id", auth, cart.getCart);

router.delete("/cart/delete/:cart_id", auth, cart.deleteCart);

router.get("/cart/qt_update/:ticket_id/:quantity", auth, cart.updateCart);

router.post("/pay/init", auth, accountCtrl.init);

router.post("/pay/callback", accountCtrl.CinetPay);

router.get("/get/transaction", accountCtrl.getTransaction);

router.get("/update/transaction", accountCtrl.UpdateTnx);

router.post("/update/profile", UseLess, auth, userCtrl.UpdateProfile);

router.post("/order", UseLess, auth, cart.OrderPlace);
router.get("/order/history", UseLess, auth, cart.OrderHistory);

module.exports = router;
