const multer = require("multer");
const fs = require("fs");

const uploadFolder = "public/images/uploads";
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
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
