const Config = require("../Models/Config");
const Postal = require("../Models/Postal");

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
