const Config = require("../Models/Config");

exports.getSettingConfig = (req, res, next) => {
  //
  const con = Config.find({}, (err, resp) => {
    if (err) res.status(200).json(err);
    if (resp) res.status(200).json(resp);
  });
  
};
