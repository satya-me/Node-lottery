// Order.js
const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    payment_id: { type: String, required: true },
    product_id: { type: String, required: true },
    unit_price: { type: String, required: true },
    quantity: { type: String, required: true },
    discount: { type: String },
    coupon_id: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
