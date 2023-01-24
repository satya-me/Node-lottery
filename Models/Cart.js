const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    user_id: { type: String, required: true },
    product_id: { type: String, required: true },
    quantity: { type: Number, required: true },
    total_cost: { type: Number, required: false },
    status: { type: Boolean, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);