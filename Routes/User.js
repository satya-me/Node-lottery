const express = require("express");
const router = express.Router();
const auth = require("../Middleware/AuthUser");
const userCtrl = require("../Controllers/User");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.post("/forget", userCtrl.forgetPassword);
router.get("/set-password/:token", userCtrl.newPasswordByEmail);

module.exports = router;
