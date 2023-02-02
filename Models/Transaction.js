const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    user_id: { type: String, required: true },
    wallet_id: { type: String, required: false },
    type: { type: String, required: false },
    message: { type: String, required: false },
    amount: { type: String, required: false },
    currency: { type: String, required: false },
    status: { type: String, required: false },
    payment_method: { type: String, required: false },
    description: { type: String, required: false },
    metadata: { type: String, required: false },
    operator_id: { type: String, required: false },
    payment_date: { type: String, required: false },

    payment_token: { type: String, required: false },
    payment_url: { type: String, required: false },

    transaction_id: { type: String, required: false },
    token: { type: String, required: false },
    merchant: { type: String, required: false },
    status_call_req: { type: String, required: false, default: "false" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
// {
//   "code": "600",
//   "message": "PAYMENT_FAILED",
//   "data": {
//       "amount": "100",
//       "currency": "XAF",
//       "status": "REFUSED",
//       "payment_method": "OMCM",
//       "description": "TEST INTEGRATION",
//       "metadata": "user1",
//       "operator_id": "MP230131.1143.A49504",
//       "payment_date": "2023-01-31 10:43:13",
//       "fund_availability_date": "2023-02-09 00:00:00"
//   },
//   "api_response_id": "1675169533.1802"
// }

// console.log({
//   amount: "100",
//   currency: "XAF",
//   description: "Test de paiement",
//   metadata: null,
//   operator_id: "MP230130.0823.A90276",
//   payment_date: "2023-01-30 07:23:02",
//   payment_method: "OMCM",
//   status: "ACCEPTED",
// });

// "_id" : ObjectId("63d3e34f7b89998eff1d7827"),
// "user_id" : "63ce2fd72bf70c6605c76e6b",
// "wallet_id" : "63d3e24e7b89998eff1d7809",
// "type" : "Recharge",
// "type_value" : "10",
// "transaction_id" : "",
// "createdAt" : ISODate("2023-01-27T14:44:31.387+0000"),
// "updatedAt" : ISODate("2023-01-27T14:44:31.387+0000"),
// "__v" : 0
