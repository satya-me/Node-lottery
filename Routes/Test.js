const express = require("express");
const router = express.Router();
// const multer = require("../Middleware/multiple-files");
const testCtrl = require("../Controllers/TestingController");
const { singleImageUpload, multipleImageUpload } = require('../Middleware/multer');

// router.post("/files_upload", multer, testCtrl.multiFileUpload);
router.post("/files_upload", singleImageUpload.single("photo"), testCtrl.multiFileUpload);
router.post("/files_uploads", multipleImageUpload.array("photos", 10), testCtrl.multiFileUpload);

router.get('/view', testCtrl.view);
router.post('/pay/callback', testCtrl.CB);
router.post('/pay/notify', testCtrl.NF);
router.get('/hi', testCtrl.HI);





module.exports = router;