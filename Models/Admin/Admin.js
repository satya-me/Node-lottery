const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const adminSchema = mongoose.Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: false, unique: true },
    phone: { type: String, required: false, unique: true },
    role: {type:String},
    password: { type: String, required: true },
  },
  { timestamps: true }
);

adminSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Admin", adminSchema);
