const express = require("express");
const router = express.Router();
// const multer = require("../../Middleware/multer-config");
// const multer_multi = require("../../Middleware/multiple-files");
const multer = require("../../Middleware/multer");
const auth = require("../../Middleware/AuthAdmin");
const adminCtrl = require("../../Controllers/Admin/Home");



router.get("/loginForm", adminCtrl.loginForn);
router.post("/login", adminCtrl.login);
router.get("/home", auth, adminCtrl.home);
router.get("/about", adminCtrl.about);

module.exports = router;
