// PhoneCode.js
const mongoose = require("mongoose");

const phoneCodeSchema = mongoose.Schema({
    name: { type: String },
    dial_code: { type: String },
    code: { type: String },
});

module.exports = mongoose.model("Phone_Code", phoneCodeSchema);
