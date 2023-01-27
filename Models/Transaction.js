const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    user_id: { type: String, required: true },
    wallet_id: { type: String, required: true },
    type: { type: String, required: true },
    type_value: { type: String, required: true },
    transaction_id: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
