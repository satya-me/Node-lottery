const Config = require("../Models/Config");
const Postal = require("../Models/Postal");
const phoneCode = require("../Models/PhoneCode");

exports.getSettingConfig = (req, res, next) => {
  //
  const con = Config.find({}, (err, resp) => {
    if (err) res.status(500).json(err);
    if (resp) res.status(200).json(resp);
  });
};

exports.getRegex = (req, res) => {
  //
  console.log(req.params.iso.toUpperCase());
  const iso = req.params.iso.toUpperCase();
  const postal = Postal.find({ ISO: iso }, (err, resp) => {
    if (err) res.status(500).json(err);
    if (resp) res.status(200).json(resp);
  });
};

exports.getPhoneCode = async (req, res) => {
  try {
    const data = await phoneCode.find({});
    // console.log(data);
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(200).json(err);
  }
};

exports.getPhoneCodeById = async (req, res) => {
  const code = req.params.code.toUpperCase();
  // res.status(200).json(code);
  // return;
  try {
    const data = await phoneCode.find({code: code});
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(200).json(err);
  }
}
