const express = require("express");
const router = express.Router();
const multer = require("../../Middleware/multer-config");
const multer_multi = require("../../Middleware/multiple-files");
const auth = require("../../Middleware/AuthAdmin");
const adminCtrl = require("../../Controllers/Admin/AdminController");

router.post("/auth/signup", adminCtrl.signup);
router.post("/auth/login", adminCtrl.login);

router.post("/add-ticket", multer_multi, auth, adminCtrl.addTicket);

module.exports = router;
