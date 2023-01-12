const mongoose = require("mongoose");

const countriesSchema = mongoose.Schema(
  {
    countries_id: { type: Number },
    name: { type: String },
    iso2: { type: String },
    phonecode: { type: String },
    currency: { type: String },
    currency_name: { type: String },
    currency_symbol: { type: String },
    region: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Countries", countriesSchema);
