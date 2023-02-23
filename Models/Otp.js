// otp.js
const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
  phone: { type: String },
  otp: { type: String },
  ref_id: { type: String },
  user_type: { type: String },
});

module.exports = mongoose.model("Opt", otpSchema);
