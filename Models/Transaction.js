const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    user_id: { type: String, required: true },
    wallet_id: { type: String },
    type: { type: String, required: true },
    type_value: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
