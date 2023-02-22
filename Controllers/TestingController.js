const fs = require("fs");
var axios = require("axios");

exports.multiFileUpload = (req, res, next) => {
  console.log({ file: req.files, body: req.body });
  if (req.fileValidationError)
    res
      .status(200)
      .json({ file_error: req.fileValidationError, file_success: req.files });

  if (!req.fileValidationError)
    res.status(200).json({
      status: "All file push to the server!",
      file: req.files,
      body: req.body,
    });
};

exports.view = (req, res) => {
  console.log(132);
  res.render("test", { name: "Satya", color: "blue" });
};


exports.CB = (req, res) => {
  console.log("CB ", req.body.transaction_id);

  var data = JSON.stringify({
    transaction_id: req.body.transaction_id, // 32460244 //86407550 ->meta
    site_id: "126127",
    apikey: "102219127563b7f7c53a41e9.62135970",
  });

  var config = {
    method: "post",
    url: "https://api-checkout.cinetpay.com/v2/payment/check",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(response.data);
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res.status(200).json(error);
    });

};

exports.NF = (req, res) => {
  console.log("NF ", req.body);
  res.status(200).json("done");
};

exports.HI = (req, res) => {
  res.status(200).json("Hello, Node is running .....");
}
