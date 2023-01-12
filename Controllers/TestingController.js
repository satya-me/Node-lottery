const fs = require("fs");

exports.multiFileUpload = (req, res, next) => {
  console.log({ file: req.files, body: req.body });
  if (req.fileValidationError)
    res
      .status(200)
      .json({ file_error: req.fileValidationError, file_success: req.files });

  if (!req.fileValidationError)
    res.status(200).json({ status: "All file push to the server!", file: req.files, body: req.body });
};
