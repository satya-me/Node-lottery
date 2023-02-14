const Contact = require("../Models/Admin/Contact");
const Mail = require("./Email/Contact");
exports.Contact = async (req, res) => {
  //   console.log(req.body);
  const contact = new Contact(req.body);
  const result = await contact.save();
  const mail = await Mail.ContactUs(result);
  console.log(mail);
  res.status(200).json(mail);
};
