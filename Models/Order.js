// Order.js
const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    product_id: { type: String, required: true },
    quantity: { type: String, required: true },
    discount: { type: String },
    unit_price: { type: String, required: true },
    total_price: { type: String, required: true },
    total_discount_price: { type: String, required: true },
    coupon_id: { type: String, default: "" },

    // 

    address: { type: String },
    roadName: { type: String },
    pincode: { type: String },
    country: { type: String },
    country_id: { type: String },
    state: { type: String },
    state_id: { type: String },
    other_info: { type: String },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
