// Postal.js
const mongoose = require("mongoose");

const postalSchema = mongoose.Schema({
  Country: { type: String },
  ISO: { type: String },
  Format: { type: String },
  Regex: { type: String },
});

module.exports = mongoose.model("postal_codes", postalSchema);
