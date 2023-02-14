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
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const fileData = file.fieldname + "-" + Date.now();

    const ext = file.originalname
      .split(".")
      .filter(Boolean)
      .slice(1)
      .join(".");

    cb(null, fileData + "." + ext);
  },
});

const singleImageUpload = multer({
  storage: storage,
});

const multipleImageUpload = multer({
  storage: storage,
});

module.exports = {
  singleImageUpload,
  multipleImageUpload,
};
