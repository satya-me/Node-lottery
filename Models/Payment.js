// Payment.js
const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    payment_using: { type: String, required: true },
    payment_type: { type: String, required: true },
    details: { type: String, required: true },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
