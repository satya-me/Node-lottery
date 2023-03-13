const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var F = "";
    if (req.body.folder == "ticket") {
      const words = req.body.ticket_name.trim().split(/\s+/);
      const maxWords = words.slice(0, 5); // select max 4 words
      const joinedWords = maxWords.join('_').toLowerCase(); // join with underscore and convert to lowercase

      F = "/" + req.body.folder + "/" + joinedWords;
    }
    if (req.body.folder == "category") {
      const words = req.body.category_name.trim().split(/\s+/);
      const maxWords = words.slice(0, 5); // select max 4 words
      const joinedWords = maxWords.join('_').toLowerCase(); // join with underscore and convert to lowercase

      F = "/" + req.body.folder + "/" + joinedWords;

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
