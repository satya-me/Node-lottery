const express = require("express");
const router = express.Router();
const auth = require("../Middleware/AuthUser");
const userCtrl = require("../Controllers/UserController");
const accountCtrl = require("../Controllers/AccountController");
const multer = require("../Middleware/Multer");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.post("/forget", userCtrl.forgetPassword);
router.get("/set-password/:token", userCtrl.newPasswordByEmail);

router.post(
  "/wallet/recharge",
  multer.singleImageUpload.single("photos"),
  auth,
  accountCtrl.recharge
);
router.get("/account/wallet/balance", auth, accountCtrl.balance);

module.exports = router;
