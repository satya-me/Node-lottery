const express = require("express");
const router = express.Router();
// const multer = require("../../Middleware/multer-config");
// const multer_multi = require("../../Middleware/multiple-files");
const multer = require("../../Middleware/multer");
const auth = require("../../Middleware/ApiAdmin");
const adminCtrl = require("../../Controllers/Admin/AdminApiController");

router.post("/auth/signup", adminCtrl.signup);
router.post("/auth/login", adminCtrl.login);

router.post(
  "/add-ticket",
  multer.singleImageUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "list_image", maxCount: 5 },
  ]),
  auth,
  adminCtrl.addTicket
);

router.post(
  "/add-category",
  multer.singleImageUpload.fields([{ name: "image", maxCount: 1 }]),
  auth,
  adminCtrl.addCategory
);

router.get("/get-category", adminCtrl.getCategory);

module.exports = router;
