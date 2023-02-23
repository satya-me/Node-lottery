const express = require("express");
const router = express.Router();
// const multer = require("../Middleware/multiple-files");
const sysCtrl = require("../Controllers/SystemController");
const UseLess = require("../Middleware/UseLess");

router.post('/register/otp', UseLess, sysCtrl.RegOTP);
router.post('/register/otp/verify', UseLess, sysCtrl.RegOTPVerify);





module.exports = router;