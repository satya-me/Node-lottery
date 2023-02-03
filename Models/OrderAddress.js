// Order.js
const mongoose = require("mongoose");

const orderAddressSchema = mongoose.Schema(
  {
    address: { type: String },
    roadName: { type: String },
    pincode: { type: String },
    country: { type: String },
    state: { type: String },
    other_info: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderAddress", orderAddressSchema);
