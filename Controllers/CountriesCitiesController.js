const fs = require("fs");
const path = require("path");
const State = require("../Models/States");
const Countries = require("../Models/Countries");

exports.countries = (req, res, next) => {
  
  const symbol = JSON.parse(process.env.CURRENCY_LIST);
  Countries.find({ currency: { $in: symbol } }).then((docs) => {
    // console.log(`Number of data found: ${docs.length}`);
    // console.log(docs);
    res.status(200).json(docs);
  });
};

exports.state = (req, res, next) => {
  // console.log(req.params.id);
  State.find({ country_id: req.params.id })
    .then((docs) => {
      // console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(200).json(err);
    });

  // let listOfTicket = fs.readFileSync(
  //   path.join(__dirname, "../Api/cities.json")
  // );
  // let list = JSON.parse(listOfTicket);
};
