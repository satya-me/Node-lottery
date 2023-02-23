const fs = require("fs");
var axios = require("axios");
const accountSid = 'ACa92ba8aa3f79a54d165f9637c7a5ae00';
const authToken = 'dab489dfaf2addef785a17b780d8b075';
const twilio = require('twilio')(accountSid, authToken);


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

exports.OTP = async (req, res) => {

  try {
    // Generate a random 6-digit OTP using the `crypto-random-string` module
    async function generateOTP() {
      // Generate a random number between 100000 and 999999
      const min = 100000;
      const max = 999999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const otp = await generateOTP();
    // Send the OTP to the user's phone number using Twilio
    const message = await twilio.messages.create({
      body: `Your OTP for new registration is: ${otp}`,
      to: '+919658730362', // Replace with the recipient's phone number
      from: '+14434999766' // Replace with your Twilio phone number
    });

    // console.log(message.sid);
    res.status(200).json({ message: `OTP ${otp} sent successfully` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
}
