const nodemailer = require("nodemailer");

exports.ContactUs = async (req, res) => {
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "satyajit.team@gmail.com", // generated ethereal user
      pass: "jilomwtinpflyoyp", // generated ethereal password
    },
  });

  var mailOptions = {
    from: '"📧 Lottery App 👻" <satyajit.team@gmail.com>',
    to: "satyajit@kotaielectronics.com",
    subject: "✅ Contact Inquiry",
    text: "That was easy!",
    html: `${req.message}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return {
      responseCode: 200,
      message:
        "We appreciate you taking the time to reach out to us and we will do our best to respond to your inquiry as soon as possible.",
    };
  } catch (error) {
    return {
      responseCode: 452,
      message:
        "We are unable to handle this request at this moment! Please try again later.",
    };
  }
};

// 63ce30b42bf70c6605c76e76
