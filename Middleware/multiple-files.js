const fs = require("fs");
const multer = require("multer");

let count = 0;

const uploadFolder = "public/images/uploads";
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
  //   fs.promises.mkdir(uploadFolder, { recursive: true });
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

const upload = multer({
  storage: storage,
});

module.exports = upload.array("photos", 10);
