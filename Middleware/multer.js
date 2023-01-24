const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.body.folder) {
      F = "/" + req.body.folder;
    } else {
      F = "";
    }
    const uploadFolder = "public/images/uploads" + F;
    console.log(uploadFolder);
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }
    // console.log("Multer ", req);
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const fileData = file.fieldname + "-" + Date.now();

    const ext = file.originalname
      .split(".")
      .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
      .slice(1)
      .join(".");

    cb(null, fileData + "." + ext);
  },
});

const singleImageUpload = multer({
  // configure multer settings for single image uploads
  storage: storage,
});

const multipleImageUpload = multer({
  // configure multer settings for multiple image uploads
  storage: storage,
});

module.exports = {
  singleImageUpload,
  multipleImageUpload,
};
